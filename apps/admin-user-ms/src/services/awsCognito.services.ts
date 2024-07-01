import {
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
  AuthFlowType,
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  RevokeTokenCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import config from "../config/index.js";
import crypto from "crypto";
import { CognitoSignUpRequest, CognitoSignUpResponse } from "../types/index.js";
import { errorMessages, HttpError } from "../errors/index.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AccessTokenPayload, AccessTokenResponse, IDTokenResponse } from "../types/jwt.types.js";

const client = new CognitoIdentityProviderClient(config.cognito.region);

/**
 * Generates a hashed secret for the given username using SHA256 algorithm.
 *
 * @param {string} username - The username for which to generate the secret.
 * @returns {string} The hashed secret.
 */
function hashSecret(username: string): string {
  return crypto
    .createHmac("SHA256", config.cognito.clientSecret)
    .update(username + config.cognito.clientId)
    .digest("base64");
}

/**
 * Signs up a new user in AWS Cognito.
 *
 * @param {CognitoSignUpRequest} user - The user data to be signed up.
 * @returns {Promise<CognitoSignUpResponse>} A promise that resolves with the signup response.
 * @throws {HttpError} Throws an HTTP error with status code 400 if signup fails.
 */
export async function createUserInCognito(user: CognitoSignUpRequest): Promise<CognitoSignUpResponse> {
  try {
    const { name, email, password } = user;

    const input = {
      ClientId: config.cognito.clientId,
      UserPoolId: config.cognito.userPoolId,
      SecretHash: hashSecret(email),
      Username: email,
      Password: password,
      ClientMetaData: { domain: config.cognito.domain },
      UserAttributes: [
        { Name: "name", Value: name },
        { Name: "email", Value: email },
      ],
    };
    const signupCommand = new SignUpCommand(input);
    const signupCommandResponse = await client.send(signupCommand);
    const adminSignupCommand = new AdminConfirmSignUpCommand(input);
    await client.send(adminSignupCommand);
    return signupCommandResponse;
  } catch (error: unknown) {
    throw new HttpError(400, "Failed to signup new user", error);
  }
}

/**
 * Removes a user from AWS Cognito.
 *
 * @param {string} email - The email of the user to be removed.
 * @throws {HttpError} Throws an HTTP error with status code 400 if removal fails.
 */
export async function removeFromCognito(email: string): Promise<void> {
  try {
    const input = { UserPoolId: config.cognito.userPoolId, Username: email };
    const command = new AdminDeleteUserCommand(input);
    await client.send(command);
  } catch (error) {
    if (error.name === "UserNotFoundException") {
      error.message = errorMessages.userNotFoundCognito;
    }
    throw new HttpError(400, error?.message || "Failed to remove user", error);
  }
}

/**
 * Authenticates a user using their email and password.
 * This function initiates an authentication command with the provided credentials
 * and returns the authentication response.
 * If authentication fails, an HttpError is thrown.
 *
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns A Promise resolving to the authentication response.
 * @throws {HttpError} If there is an error during authentication.
 */
export const authenticateUser = async (email: string, password: string): Promise<InitiateAuthCommandOutput> => {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: { USERNAME: email, PASSWORD: password, SECRET_HASH: hashSecret(email) },
      ClientId: config.cognito.clientId,
    });

    const initiateAuthResponse = await client.send(command);
    return initiateAuthResponse;
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to authenticate user", error);
  }
};

/**
 * Updates the user's password in AWS Cognito.
 *
 * @param {string} oldPassword - The user's current password.
 * @param {string} newPassword - The new password to set for the user.
 * @param {string} accessToken - The access token for the user session.
 * @returns {Promise<void>} A Promise that resolves when the password is successfully updated.
 * @throws {HttpError} Throws an HTTP error with status code 400 if the password change fails.
 */
export async function updateUserPasswordInCognito(
  oldPassword: string,
  newPassword: string,
  accessToken: string,
): Promise<void> {
  try {
    const command = new ChangePasswordCommand({
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
      AccessToken: accessToken,
    });
    await client.send(command);
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to change password", error);
  }
}

/**
 * Revokes the specified refresh token using the Cognito service.
 *
 * @param {string} refreshToken - The refresh token to be revoked.
 * @returns {Promise<void>} A promise that resolves once the token revocation process is complete.
 * @throws {HttpError} If an error occurs during the token revocation process, it throws an HTTP error with status code 400.
 */
export async function revokeCognitoToken(refreshToken: string): Promise<void> {
  try {
    // Revoke the token via Cognito
    const command = new RevokeTokenCommand({
      Token: refreshToken,
      ClientId: config.cognito.clientId,
      ClientSecret: config.cognito.clientSecret,
    });

    await client.send(command);
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to Logout", error);
  }
}

/**
 * Sends a forgot password request to AWS Cognito.
 *
 * This function will send a request to AWS Cognito to initiate the password reset process for a user.
 * If the user does not have a registered/verified email or phone number, an error will be thrown.
 *
 * @param {string} email - The email address of the user who wants to reset their password.
 * @returns {Promise<void>} - A promise that resolves when the password reset request has been successfully sent.
 * @throws {HttpError} - Throws an HttpError with status 400 if the password reset request fails.
 */
export async function forgotPasswordCognito(email: string): Promise<void> {
  try {
    const input = {
      ClientId: config.cognito.clientId,
      UserPoolId: config.cognito.userPoolId,
      SecretHash: hashSecret(email),
      Username: email,
    };
    const command: ForgotPasswordCommand = new ForgotPasswordCommand(input);
    await client.send(command);
  } catch (error) {
    if (error?.name === "InvalidParameterException") {
      error.message = errorMessages.unverifiedUserCognito;
    }

    throw new HttpError(400, error?.message || "Failed to send forgot password email", error);
  }
}

/**
 * Confirms the forgot password process using AWS Cognito.
 *
 * This function sends a request to AWS Cognito to confirm the password reset for a user.
 *
 * @param {string} email - The email of the user requesting the password reset.
 * @param {string} code - The confirmation code sent to the user.
 * @param {string} newPassword - The new password that the user wants to set.
 * @returns {Promise<void>} - A promise that resolves when the password reset is confirmed.
 * @throws {HttpError} - Throws an error if the password reset fails.
 */
export async function conformForgetPasswordCognito(email: string, code: string, newPassword: string): Promise<void> {
  try {
    const input = {
      ClientId: config.cognito.clientId,
      UserPoolId: config.cognito.userPoolId,
      SecretHash: hashSecret(email),
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    };
    const command = new ConfirmForgotPasswordCommand(input);

    await client.send(command);
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to reset password", error);
  }
}

/**
 * Generates a new access token using a refresh token and an ID token.
 * @param {string} refreshToken - The refresh token used to generate the new access token.
 * @param {string} idToken - The ID token associated with the user.
 * @returns {Promise<AccessTokenPayload>} The new access token payload.
 * @throws {HttpError} Throws an HTTP error if the operation fails.
 */
export async function generateNewAccessToken(refreshToken: string, idToken: string): Promise<AccessTokenPayload> {
  try {
    const { username }: IDTokenResponse = await decodeIdToken(idToken);
    const command: InitiateAuthCommand = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      AuthParameters: { REFRESH_TOKEN: refreshToken, SECRET_HASH: hashSecret(username) },
      ClientId: config.cognito.clientId,
    });

    const data: InitiateAuthCommandOutput = await client.send(command);

    const response: AccessTokenPayload = {
      accessToken: data.AuthenticationResult?.AccessToken,
      idToken: data.AuthenticationResult?.IdToken,
      expiresIn: data.AuthenticationResult?.ExpiresIn,
    };

    return response;
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to generate new access token", error);
  }
}

/**
 * Decodes an ID token and returns its contents.
 * @param {string} idToken - The ID token to decode.
 * @returns {Promise<IDTokenResponse>} The decoded contents of the ID token.
 * @throws {HttpError} Throws an HTTP error if decoding fails.
 */
export async function decodeIdToken(idToken: string): Promise<IDTokenResponse> {
  try {
    const decodedToken = jwt.decode(idToken) as JwtPayload;

    // Convert values to match IDTokenResponse interface
    const decodedIdToken: IDTokenResponse = {
      sub: decodedToken.sub || "",
      emailVerified: decodedToken.email_verified || false,
      iss: decodedToken.iss || "",
      username: decodedToken["cognito:username"] || "",
      originJti: decodedToken.origin_jti || "",
      aud: decodedToken.aud || "",
      eventId: decodedToken.event_id || "",
      tokenUse: decodedToken.token_use || "",
      roleId: decodedToken["custom:roleId"] || "",
      authTime: new Date(decodedToken.auth_time || 0),
      name: decodedToken.name || "",
      exp: new Date(decodedToken.exp || 0),
      iat: new Date(decodedToken.iat || 0),
      jti: decodedToken.jti || "",
      email: decodedToken.email || "",
    };

    return decodedIdToken;
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to decode id token", error);
  }
}

/**
 * Decodes an access token and returns its contents.
 * @param {string} accessToken - The access token to decode.
 * @returns {Promise<AccessTokenResponse>} The decoded contents of the access token.
 * @throws {HttpError} Throws an HTTP error if decoding fails.
 */
export async function decodeAccessToken(accessToken: string): Promise<AccessTokenResponse> {
  try {
    const decodedToken = jwt.decode(accessToken) as JwtPayload;
    const decodedAccessToken: AccessTokenResponse = {
      sub: decodedToken.sub || "",
      iss: decodedToken.iss || "",
      clientId: decodedToken.client_id || "",
      originJti: decodedToken.origin_jti || "",
      eventId: decodedToken.event_id || "",
      tokenUse: decodedToken.token_use || "",
      scope: decodedToken.scope || "",
      authTime: new Date(decodedToken.auth_time || 0),
      exp: new Date(decodedToken.exp || 0),
      iat: new Date(decodedToken.iat || 0),
      jti: decodedToken.jti || "",
      username: decodedToken.username || "",
    };
    return decodedAccessToken;
  } catch (error) {
    throw new HttpError(400, error?.message || "Failed to decode access token", error);
  }
}
