import { Request, Response } from "express";
import {
  createUser,
  fetchUserWithRole,
  getDbUsers,
  markUserAsDeleted,
  retrieveUser,
  updateIamId,
  updatePassword,
  updateUser,
  updateUserStatus,
} from "../services/user.services.js";
import {
  createUserMenuPermissions,
  getUserPermissions,
  updateUserMenuPermissions,
} from "../services/menuPermission.services.js";
import {
  isValidEmail,
  isValidUUID,
  userAlreadyExists,
  userNotExist,
  validateChangePasswordReqBody,
  validateConformPasswordReqBody,
  validateGetUsersQueryParams,
  validateLoginReqBody,
  validateToken,
  validateUserRegisterReqBody,
  validateUserUpdateReqBody,
} from "../validators/index.js";
import {
  ChangePasswordRequest,
  CognitoSignUpResponse,
  ForgetPasswordRequest,
  GlobalResponseFailed,
  GlobalResponseSuccess,
  PaginationQuery,
  RequestWithLoggedInUser,
  resStatusType,
  UserContext,
  UserLoginReqBody,
  UserRegister,
  UserUpdate,
} from "../types/index.js";
import { generateRandomPassword } from "../utils/index.js";
import {
  authenticateUser,
  conformForgetPasswordCognito,
  createUserInCognito,
  forgotPasswordCognito,
  generateNewAccessToken,
  removeFromCognito,
  revokeCognitoToken,
  updateUserPasswordInCognito,
} from "../services/awsCognito.services.js";
import { GetUsersResponse, User, UserWithRole } from "../viewModel/user.viewModel.js";
import { InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { UserPermissions } from "../types/permission.types.js";
import { models, sequelize } from "@condo-server/db-models";
import { AccessTokenPayload } from "../types/jwt.types.js";
import { compileAndSendMail } from "@condo-server/notification-engine";
import { emailTemplateNames } from "../constants/index.js";

export async function getUsers(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  try {
    let pageAndLimit = req.query as unknown as PaginationQuery;
    pageAndLimit = await validateGetUsersQueryParams(pageAndLimit);

    const users: GetUsersResponse = await getDbUsers(pageAndLimit);
    const response = {
      status: resStatusType.Success,
      message: "Users retrieved",
      data: users,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .json({ status: resStatusType.Failed, message: error?.message || "Failed to get users" });
  }
}

/**
 *This function handles the login process for a user.
 *
 * @param req - The request object, expecting email and password in the body.
 * @param res - The response object used to send the response to the client.
 *
 * The function follows these steps:
 * 1) Extracts the email and password from the request body.
 * 2) Calls the fetchUserWithRoleByEmail function to get the user with the provided email.
 * 3) If the user exists, it fetches the user's permissions.
 * Authenticates the user using the provided email and password.
 * If authentication is successful, it constructs the response data, which includes access, id, and refresh tokens, as well as the user's information and permissions.
 * Sends a successful response with the response data.
 */
export async function logIn(req: Request, res: Response): Promise<Response> {
  try {
    const loginBody: UserLoginReqBody = req.body;
    const { email, password } = await validateLoginReqBody(loginBody);
    const user: UserWithRole = await fetchUserWithRole("email", email);

    const userResponse: InitiateAuthCommandOutput = await authenticateUser(email, password);

    const permissions: UserPermissions[] = await getUserPermissions(user?.id);
    const responseData = {
      accessToken: userResponse.AuthenticationResult?.AccessToken || "",
      idToken: userResponse.AuthenticationResult?.IdToken || "",
      refreshToken: userResponse.AuthenticationResult?.RefreshToken || "",
      accessTokenExpiresIn: userResponse.AuthenticationResult?.ExpiresIn || 0,
      user: { ...user, permissions },
    };

    return res
      .status(200)
      .json({ status: resStatusType.Success, message: "Sign in successfully, Welcome to admin", data: responseData });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ status: resStatusType.Failed, message: error.message || "Failed to login" });
  }
}

/**
 * Registers a new user.
 *
 * @param {RequestWithLoggedInUser} req - The HTTP request object with logged in user information.
 * @param {Response} res - The HTTP response object.
 */
export async function registerUser(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  const transaction = await sequelize.transaction();
  try {
    const contextUser: UserContext = req.user;
    const userRegister: UserRegister = await validateUserRegisterReqBody(req.body);
    const user: UserWithRole = await fetchUserWithRole("email", userRegister.email);
    await userAlreadyExists(user);
    const newlyCreatedUser: models.usersAttributes = await createUser(userRegister, contextUser.id, transaction);

    const permissions = userRegister.permissions;
    await createUserMenuPermissions(permissions, newlyCreatedUser.id, transaction);

    const password: string = await generateRandomPassword();

    const cognitoUser: CognitoSignUpResponse = await createUserInCognito({
      name: userRegister.name,
      email: userRegister.email,
      password,
    });

    await updateIamId(cognitoUser.UserSub, "email", newlyCreatedUser.email, transaction);

    await compileAndSendMail(
      emailTemplateNames.WELCOME_EMAIL,
      { email: userRegister.email, password },
      { to: userRegister.email, subject: "Welcome to Hello Condo!" },
    );

    transaction.commit();
    return res.status(201).json({ status: resStatusType.Success, message: "User registered successfully" });
  } catch (error) {
    transaction.rollback();
    // TODO: if user creation fails in cognito,
    return res
      .status(error?.statusCode || 500)
      .json({ status: resStatusType.Failed, message: error?.message || "Error" });
  }
}

/**
 * Changes the user's password by updating it in AWS Cognito and the database.
 *
 * @param {RequestWithLoggedInUser} req - The request object containing user information.
 * @param {Response} res - The response object to send back to the client.
 */
export async function changePassword(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  const transaction = await sequelize.transaction();
  try {
    const { oldPassword, newPassword }: ChangePasswordRequest = await validateChangePasswordReqBody(req.body);
    const accessToken: string = req.headers.authorization?.split(" ")[1] || "";
    const id: string = req.user.id;
    await updateUserPasswordInCognito(oldPassword, newPassword, accessToken);
    await updatePassword(id, transaction);

    transaction.commit();
    return res.status(200).json({ status: resStatusType.Success, message: "Password changed successfully" });
  } catch (error) {
    transaction.rollback();
    return res
      .status(error?.statusCode || 500)
      .json({ status: resStatusType.Failed, message: error?.message || "Failed to change password" });
  }
}

/**
 * Logs out the user by revoking the refresh token.
 *
 * @param {RequestWithLoggedInUser} req - The request object containing the logged-in user's information.
 * @param {Response} res - The response object used to send the logout status.
 * @returns {Promise<Response>} A promise that resolves with the logout status response.
 * @throws {Error} If an error occurs during logout, such as validation failure or token revocation failure.
 */
export async function logOut(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  try {
    const refreshToken: string = req.body.refreshToken;
    await validateToken(refreshToken);

    await revokeCognitoToken(refreshToken);

    return res.status(200).json({ status: resStatusType.Success, message: "User Logged out successfully" });
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .json({ status: resStatusType.Failed, message: error?.message || "Failed to logout" });
  }
}

/**
 * Initiates the password reset process by sending a confirmation code to the user's email.
 *
 * @param {Request} req - The request object containing the user's email.
 * @param {Response} res - The response object used to send the password reset status.
 * @returns {Promise<Response>} A promise that resolves with the password reset status response.
 * @throws {Error} If an error occurs during the password reset process, such as validation failure or failure to send the confirmation code.
 */
export async function forgotPassword(req: Request, res: Response): Promise<Response> {
  try {
    const email: string = req.body.email;
    await isValidEmail(email);
    const user: UserWithRole = await fetchUserWithRole("email", email);

    userNotExist(user);
    await forgotPasswordCognito(email);

    const response: GlobalResponseSuccess = {
      status: resStatusType.Success,
      message: "Password reset initiated. Confirmation code sent to user.",
    };
    return res.status(200).json(response);
  } catch (error) {
    const response: GlobalResponseFailed = {
      status: resStatusType.Failed,
      message: error?.message || "Error initiating password reset. Please try again.",
    };
    return res.status(error?.statusCode || 500).json(response);
  }
}

/**
 * Handles the confirmation of a forgot password request.
 *
 * This function validates the request body, fetches the user information, and confirms the password reset
 * using AWS Cognito. It sends an appropriate response based on the outcome.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} - A promise that resolves to the Express response object.
 * @throws {Error} - Throws an error if the password reset process fails.
 */
export async function conformForgetPassword(req: Request, res: Response): Promise<Response> {
  try {
    const { email, confirmationCode, newPassword }: ForgetPasswordRequest = validateConformPasswordReqBody(req.body);

    const user: UserWithRole = await fetchUserWithRole("email", email);
    userNotExist(user);

    await conformForgetPasswordCognito(email, confirmationCode, newPassword);

    const response: GlobalResponseSuccess = { status: resStatusType.Success, message: "Password reset successfully" };

    return res.status(200).json(response);
  } catch (error) {
    const failedResponse: GlobalResponseFailed = {
      status: resStatusType.Failed,
      message: error?.message || "Failed to reset password.",
    };
    return res.status(error?.statusCode || 500).json(failedResponse);
  }
}

/**
 * Edits a user's information.
 *
 * @param {RequestWithLoggedInUser} req - The request object containing the user's information.
 * @param {Response} res - The response object used to send the response to the client.
 * @returns {Promise<Response>} A promise that resolves with the response to the client.
 */
export async function editUser(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  const transaction = await sequelize.transaction();
  try {
    const contextUser: UserContext = req.user;
    const user: UserUpdate = await validateUserUpdateReqBody(req.body);

    await updateUser(user.id, user, contextUser.id, transaction);
    const permissions = user.permissions;
    await updateUserMenuPermissions(permissions, user.id, transaction);

    transaction.commit();
    const response: GlobalResponseSuccess = {
      status: resStatusType.Success,
      message: "User updated successfully",
    };

    return res.status(200).json(response);
  } catch (error) {
    transaction.rollback();
    const failedResponse: GlobalResponseFailed = {
      status: resStatusType.Failed,
      message: error?.message || "Failed to update user",
    };
    return res.status(error?.statusCode || 500).json(failedResponse);
  }
}

/**
 * Handles the request to retrieve a user by their ID and sends the response.
 *
 * @param {RequestWithLoggedInUser} req - The request object, including the logged-in user's information and the user ID in the params.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A promise that resolves with the response containing the user data and permissions.
 * @throws {GlobalResponseFailed} Returns an error response if the retrieval operation fails.
 */
export async function getUser(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  try {
    const userId: string = req.params.id;

    const user: User = await retrieveUser(userId);
    await userNotExist(user);

    const permissions: UserPermissions[] = await getUserPermissions(user.id);
    const response: GlobalResponseSuccess = {
      status: resStatusType.Success,
      message: "User retrieved successfully",
      data: { ...user, permissions },
    };

    return res.status(200).json(response);
  } catch (error) {
    const failedResponse: GlobalResponseFailed = {
      status: resStatusType.Failed,
      message: error?.message || "Failed to retrieve user",
    };
    return res.status(error?.statusCode || 500).json(failedResponse);
  }
}

/**
 * Toggles the status of a user between active and inactive.
 *
 * @param {RequestWithLoggedInUser} req - The request object containing the user's information.
 * @param {Response} res - The response object used to send the response to the client.
 * @returns {Promise<Response>} A promise that resolves with the response to the client.
 */
export async function changeUserStatus(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  const transaction = await sequelize.transaction();
  try {
    const contextUser: UserContext = req.user;
    const userId: string = req.params.id;

    await isValidUUID(userId);
    const user: User = await retrieveUser(userId);
    await userNotExist(user);

    const message: string = await updateUserStatus(userId, !user.isActive, contextUser.id, transaction);

    transaction.commit();

    const response: GlobalResponseSuccess = { status: resStatusType.Success, message };
    return res.status(200).json(response);
  } catch (error) {
    transaction.rollback();
    const failedResponse: GlobalResponseFailed = {
      status: resStatusType.Failed,
      message: error?.message || "Failed to change user status",
    };
    return res.status(error?.statusCode || 500).json(failedResponse);
  }
}

/**
 * Refreshes the access token using the refresh token.
 *
 * @param {Request} req - The request object containing the refresh token.
 * @param {Response} res - The response object used to send the response to the client with the new access token.
 * @returns {Promise<Response>} A promise that resolves with the response to the client.
 */
export async function refreshAccessToken(req: Request, res: Response): Promise<Response> {
  try {
    const refreshToken: string = req.body.refreshToken;
    const idToken: string = req.body.idToken;
    await validateToken(refreshToken);
    await validateToken(idToken);

    const response: AccessTokenPayload = await generateNewAccessToken(refreshToken, idToken);

    return res
      .status(201)
      .json({ status: resStatusType.Success, message: "Token refreshed successfully", data: response });
  } catch (error) {
    return res
      .status(error?.statusCode || 500)
      .json({ status: resStatusType.Failed, message: error?.message || "Failed to refresh token" });
  }
}

/**
 * Deletes a user from the database and Cognito.
 *
 * @param {RequestWithLoggedInUser} req - The request object, containing the logged in user and the id of the user to be deleted.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - Returns a promise that resolves with a response object. The response object contains a status code and a JSON object with the status and message of the operation.
 *
 * @throws Will throw an error if the user id is not a valid UUID, if the user does not exist, or if there is a problem with the database transaction.
 */
export async function deleteUser(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  const t = await sequelize.transaction();
  try {
    const contextUser: UserContext = req.user;
    const userId: string = req.params.id;

    const user: User = await retrieveUser(userId);
    await userNotExist(user);

    await markUserAsDeleted(userId, contextUser.id, t);
    await removeFromCognito(user.email);

    t.commit();

    const response: GlobalResponseSuccess = { status: resStatusType.Success, message: "User deleted successfully" };
    return res.status(200).json(response);
  } catch (error) {
    t.rollback();
    const failedResponse: GlobalResponseFailed = {
      status: resStatusType.Failed,
      message: error?.message || "Failed to delete user",
    };
    return res.status(error?.statusCode || 500).json(failedResponse);
  }
}
