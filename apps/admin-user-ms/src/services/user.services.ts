import { db, models, sq } from "@condo-server/db-models";
import { HttpError } from "../errors/index.js";
import { PaginationQuery, UserContext, UserRegister, UserUpdate } from "../types/index.js";
import { UserPermissions } from "../types/permission.types.js";
import { GetUsersResponse, User, UserWithRole } from "../viewModel/user.viewModel.js";
import { getUserPermissions } from "./menuPermission.services.js";

export async function getDbUsers({ page, limit }: PaginationQuery): Promise<GetUsersResponse> {
  try {
    page = page || 1;
    limit = limit || 10;

    const offset = (page - 1) * limit;
    const users = (await db.users.findAndCountAll({
      where: { isDelete: false },
      nest: true,
      raw: true,
      attributes: ["id", "name", "email", "phoneNumber", "roleId", "isActive", [sq.col("role.role_name"), "roleName"]],
      order: [["id", "ASC"]],
      include: [
        {
          model: db.userRoles,
          as: "role",
          attributes: [],
        },
      ],
      offset,
      limit,
    })) as unknown as GetUsersResponse;
    return users;
  } catch (error) {
    throw new HttpError(500, "Failed to fetch users");
  }
}

/**
 * Fetches user information along with their role based on the provided email.
 * @param email - The email address of the user to fetch.
 * @returns A Promise resolving to an object representing the user with their role.
 * @throws {HttpError} If there is an error while fetching the user.
 */
export async function fetchUserWithRole(whereKey: string, whereValue: string): Promise<UserWithRole | null> {
  try {
    const where = { [whereKey]: whereValue, isDelete: false, deletedAt: null };
    const user = (await db.users.findOne({
      where,
      raw: true,
      nest: true,
      attributes: [
        "id",
        "name",
        "email",
        "isPasswordReset",
        [sq.col("role.role_name"), "roleName"],
        [sq.col("role.is_admin"), "isAdmin"],
      ],
      include: [
        {
          model: db.userRoles,
          as: "role",
          attributes: [],
        },
      ],
    })) as unknown as UserWithRole;

    return user;
  } catch (error) {
    throw new HttpError(500, "Failed to fetch user with role by email");
  }
}

/**
 * Creates a new user in the database.
 *
 * @param {UserRegister} userRegister - The user registration data.
 * @param {string} createdBy - The ID of the user who is creating the new user.
 * @param {Transaction} transaction - The transaction object for database operations.
 * @returns {Promise<usersAttributes>} The raw value of the newly created user object.
 * @throws {HttpError} Throws an HTTP error with status code 500 if user creation fails.
 */
export async function createUser(
  userRegister: UserRegister,
  createdBy: string,
  transaction: sq.Transaction,
): Promise<models.usersAttributes> {
  try {
    // Create the new user in the database
    const newlyCreatedUser = await db.users.create(
      {
        name: userRegister.name,
        email: userRegister.email,
        phoneNumber: userRegister.phoneNumber,
        roleId: userRegister.roleId,
        description: userRegister.description,
        createdBy,
        updatedBy: createdBy,
      },
      { transaction },
    );

    // Get the raw value of the user object
    const rawUserValue = newlyCreatedUser.get({ plain: true });

    return rawUserValue;
  } catch (error) {
    throw new HttpError(500, "Failed to register user");
  }
}

/**
 * Updates the IAM ID of a user in the database.
 *
 * @param {string} iamId - The IAM ID to update.
 * @param {string} whereKey - The key to identify the user (e.g., 'email', 'id', 'iam_id').
 * @param {string} whereValue - The value corresponding to the 'whereKey' to identify the user.
 * @param {Transaction} transaction - The transaction object for database operations.
 * @returns {Promise<void>} A void indicating whether the update was successful.
 * @throws {HttpError} Throws an HTTP error with status code 500 if user update fails.
 */
export async function updateIamId(
  iamId: string,
  whereKey: string,
  whereValue: string,
  transaction: sq.Transaction,
): Promise<void> {
  try {
    const where = { [whereKey]: whereValue };

    // Update the IAM ID of the user in the database
    await db.users.update({ iamId }, { where, transaction });
  } catch (error) {
    throw new HttpError(500, "Failed to update user");
  }
}

/**
 * Creates the user context by fetching user details and permissions.
 *
 * @param {string} iamId - The IAM ID of the user.
 * @returns {Promise<object>} The user context data including user details and permissions.
 * @throws {HttpError} Throws an HTTP error with status code 500 if user context creation fails.
 */
export async function createUserContext(iamId: string): Promise<UserContext> {
  try {
    const user: UserWithRole = await fetchUserWithRole("iamId", iamId);

    const permissions: UserPermissions[] = await getUserPermissions(user?.id);

    const responseData = { ...user, permissions };

    return responseData;
  } catch (error) {
    throw new HttpError(500, "Failed to create user context");
  }
}

/**
 * Updates the password of a user identified by the provided ID.
 *
 * @param id The ID of the user whose password needs to be updated.
 * @param transaction The transaction object for database operations.
 * @returns A Promise that resolves when the password is successfully updated.
 * @throws {HttpError} If an error occurs during the password update process.
 */
export async function updatePassword(id: string, transaction: sq.Transaction): Promise<void> {
  try {
    await db.users.update(
      {
        isPasswordReset: true,
        lastPasswordReset: new Date(),
      },
      { where: { id }, transaction },
    );
  } catch (error) {
    throw new HttpError(500, "Failed to update user password");
  }
}

/**
 * Updates user details in the database.
 *
 * @param {string} id - The ID of the user to be updated.
 * @param {UserUpdate} data - An object containing the user details to be updated, including `name`, `email`, `phoneNumber`, `roleId`, and `description`.
 * @param {string} updatedBy - The ID of the user who is performing the update.
 * @param {Transaction} transaction - The transaction object to ensure atomicity of the operation.
 *
 * @returns {Promise<void>} A promise that resolves when the user details have been successfully updated.
 *
 * @throws {HttpError} Throws an error if the update operation fails.
 */
export async function updateUser(
  id: string,
  data: UserUpdate,
  updatedBy: string,
  transaction: sq.Transaction,
): Promise<void> {
  try {
    await db.users.update(
      {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        roleId: data.roleId,
        description: data.description,
        updatedBy,
      },
      { where: { id }, transaction },
    );
  } catch (error) {
    throw new HttpError(500, "Failed to update user");
  }
}

/**
 * Retrieves a user from the database by their UUID.
 *
 * @param {string} id - The UUID of the user to be retrieved.
 * @returns {Promise<User>} A promise that resolves with the user data.
 * @throws {HttpError} Throws an error if the retrieval operation fails.
 */
export async function retrieveUser(id: string): Promise<User> {
  try {
    const user = (await db.users.findOne({
      where: { id, isDelete: false, deletedAt: null },
      raw: true,
      nest: true,
      attributes: [
        "id",
        "name",
        "email",
        "phoneNumber",
        "roleId",
        "description",
        "isActive",
        [sq.col("role.role_name"), "roleName"],
      ],
      include: [
        {
          model: db.userRoles,
          as: "role",
          attributes: [],
        },
      ],
    })) as unknown as User;
    return user;
  } catch (error) {
    throw new HttpError(500, "Failed to fetch user");
  }
}

/**
 * Searches for an email in the database for a given email ID.
 *
 * @param {string} email - The email ID to search for.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the email exists.
 * @throws {HttpError} Throws an error if the search operation fails.
 */
export async function performEmailSearch(email: string): Promise<boolean> {
  try {
    const user = await db.users.findOne({
      where: { email: { [sq.Op.iLike]: `%${email}%` }, deletedAt: null, isDelete: false },
    });
    return !!user;
  } catch (error) {
    throw new HttpError(500, "Failed to search for email");
  }
}

/**
 * Updates the status of a user in the database.
 *
 * @param {string} id - The ID of the user to update.
 * @param {boolean} isActive - The new status of the user.
 * @param {string} updatedBy - The ID of the user performing the update.
 * @param {Transaction} transaction - The transaction object for database operations.
 * @returns {Promise<string>} A promise that resolves with a message indicating the success of the update.
 * @throws {HttpError} Throws an HTTP error with status code 500 if the user status update fails.
 */
export async function updateUserStatus(
  id: string,
  isActive: boolean,
  updatedBy: string,
  transaction: sq.Transaction,
): Promise<string> {
  try {
    await db.users.update({ isActive, updatedBy }, { where: { id }, transaction });
    const message = isActive ? "User activated successfully" : "User deactivated successfully";
    return message;
  } catch (error) {
    throw new HttpError(500, "Failed to update user status");
  }
}
/**
 * Marks a user as deleted in the database.
 *
 * @param {string} id - The ID of the user to mark as deleted.
 * @param {string} updatedBy - The ID of the user performing the update.
 * @param {Transaction} transaction - The transaction to use for the database operation.
 * @returns {Promise<void>} - A promise that resolves when the user is marked as deleted.
 * @throws {HttpError} - Throws an error if the user could not be marked as deleted.
 */
export async function markUserAsDeleted(id: string, updatedBy: string, transaction: sq.Transaction): Promise<void> {
  try {
    await db.users.update(
      { isDelete: true, updatedBy, deletedAt: new Date(), deletedBy: updatedBy },
      { where: { id }, transaction },
    );
  } catch (error) {
    throw new HttpError(500, "Failed to delete user from database");
  }
}
