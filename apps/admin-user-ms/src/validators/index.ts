import Joi from "joi";
import { HttpError } from "../errors/index.js";
import {
  ChangePasswordRequest,
  ForgetPasswordRequest,
  PaginationQuery,
  UserLoginReqBody,
  UserRegister,
  UserUpdate,
} from "../types/index.js";
import { User, UserWithRole } from "../viewModel/user.viewModel.js";

const getUsersSchema = Joi.object({
  page: Joi.number().required().messages({
    "number.base": "Page must be a valid number.",
    "any.required": "Page is a required field.",
  }),
  limit: Joi.number().required().messages({
    "number.base": "Limit must be a valid number.",
    "any.required": "Limit is a required field.",
  }),
});

const permissionSchema = Joi.object({
  menuId: Joi.string().required().messages({
    "string.base": `"menuId" should be a type of 'text'`,
    "string.empty": `"menuId" cannot be an empty field`,
    "any.required": `"menuId" is a required field`,
  }),
  section: Joi.string().required().messages({
    "string.base": `"section" should be a type of 'text'`,
    "string.empty": `"section" cannot be an empty field`,
    "any.required": `"section" is a required field`,
  }),
  displayName: Joi.string().required().messages({
    "string.base": `"displayName" should be a type of 'text'`,
    "string.empty": `"displayName" cannot be an empty field`,
    "any.required": `"displayName" is a required field`,
  }),
  isRead: Joi.boolean().required().messages({
    "boolean.base": `"isRead" should be a type of 'boolean'`,
    "any.required": `"isRead" is a required field`,
  }),
  isWrite: Joi.boolean().required().messages({
    "boolean.base": `"isWrite" should be a type of 'boolean'`,
    "any.required": `"isWrite" is a required field`,
  }),
  isDelete: Joi.boolean().required().messages({
    "boolean.base": `"isDelete" should be a type of 'boolean'`,
    "any.required": `"isDelete" is a required field`,
  }),
});

const userRegisterSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name should be a type of 'text'",
    "string.empty": "Name cannot be an empty field",
    "any.required": "Name is a required field",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of 'text'",
    "string.empty": "Email cannot be an empty field",
    "string.email": "Email must be a valid email",
    "any.required": "Email is a required field",
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .allow("")
    .messages({
      "string.base": "Phone Number should be a type of 'text'",
      "string.empty": "Phone Number cannot be an empty field",
      "string.pattern.base": "Phone Number must be a valid 10-digit number",
      "any.required": "Phone Number is a required field",
    }),
  roleId: Joi.string().required().messages({
    "string.base": "Role should be a type of 'text'",
    "string.empty": "Role cannot be an empty field",
    "any.required": "Role is a required field",
  }),
  description: Joi.string().allow("").messages({
    "string.base": "Description should be a type of 'text'",
    "string.empty": "Description cannot be an empty field",
    "any.required": "Description is a required field",
  }),
  permissions: Joi.array().items(permissionSchema).required().messages({
    "array.base": "Permissions should be an array",
    "any.required": "Permissions is a required field",
  }),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.base": `oldPassword should be a type of 'text'`,
    "string.empty": `oldPassword cannot be an empty field`,
    "any.required": `oldPassword is a required field`,
  }),
  newPassword: Joi.string()
    .pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20}$"))
    .required()
    .messages({
      "string.base": `newPassword should be a type of 'text'`,
      "string.empty": `newPassword cannot be an empty field`,
      "string.pattern.base": `newPassword must be 8-20 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character among @#$%`,
      "any.required": `newPassword is a required field`,
    }),
});

export function validateGetUsersQueryParams({ page, limit }: PaginationQuery): PaginationQuery {
  const { error, value } = getUsersSchema.validate({ page, limit });
  if (error) {
    throw new HttpError(400, error.message);
  }
  return value;
}

const loginReqBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email.",
    "any.required": "Email is a required field.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password cannot be an empty field.",
    "any.required": "Password is a required field.",
  }),
});

const userUpdateSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": `id should be a type of 'text'`,
    "string.empty": `id cannot be an empty field`,
    "any.required": `id is a required field`,
  }),
  name: Joi.string().required().messages({
    "string.base": `name should be a type of 'text'`,
    "string.empty": `name cannot be an empty field`,
    "any.required": `name is a required field`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `email should be a type of 'text'`,
    "string.empty": `email cannot be an empty field`,
    "string.email": `email must be a valid email`,
    "any.required": `email is a required field`,
  }),
  phoneNumber: Joi.string()
    .allow("")
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.base": `Phone Number should be a type of 'text'`,
      "string.empty": `Phone Number cannot be an empty field`,
      "string.pattern.base": `Phone Number must be a valid 10-digit number`,
    }),
  roleId: Joi.string().required().messages({
    "string.base": `Role should be a type of 'text'`,
    "string.empty": `Role cannot be an empty field`,
    "any.required": `Role is a required field`,
  }),
  description: Joi.string().allow("").messages({
    "string.base": `Description should be a type of 'text'`,
  }),
  permissions: Joi.array().items(permissionSchema).required().messages({
    "array.base": `"permissions" should be an array`,
    "any.required": `"permissions" is a required field`,
  }),
});

export async function validateLoginReqBody({ email, password }: UserLoginReqBody): Promise<UserLoginReqBody> {
  const { error, value } = loginReqBodySchema.validate({ email, password });
  if (error) {
    throw new HttpError(400, error.message);
  }
  return value;
}

export async function validateUserRegisterReqBody(userRegister: UserRegister): Promise<UserRegister> {
  const { error, value } = userRegisterSchema.validate(userRegister);
  if (error) {
    throw new HttpError(400, error.message);
  }
  return value;
}

export async function userAlreadyExists(user: UserWithRole | null) {
  if (user) {
    throw new HttpError(400, "User already exists");
  }
}

export async function validateChangePasswordReqBody(data: ChangePasswordRequest): Promise<ChangePasswordRequest> {
  const { error, value } = changePasswordSchema.validate(data);
  if (error) {
    throw new HttpError(400, error.message);
  }
  return value;
}

export function validateToken(refreshToken: string): void {
  const schema = Joi.string().required().messages({
    "string.base": "Refresh token must be a string.",
    "string.empty": "Refresh token cannot be an empty field.",
    "any.required": "Refresh token is a required field.",
  });
  const { error } = schema.validate(refreshToken);
  if (error) {
    throw new HttpError(400, error.message);
  }
}

export function userNotExist(user: UserWithRole | null | User) {
  if (!user) {
    throw new HttpError(404, "User not found or incorrect email/id");
  }
}

export function validateConformPasswordReqBody(data: ForgetPasswordRequest): ForgetPasswordRequest {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email.",
      "any.required": "Email is a required field.",
    }),
    newPassword: Joi.string()
      .pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20}$"))
      .required()
      .messages({
        "string.base": `Password should be a type of 'text'`,
        "string.empty": `Password cannot be an empty field`,
        "string.pattern.base": `Password must be 8-20 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character among @#$%`,
        "any.required": `Password is a required field`,
      }),
    confirmationCode: Joi.string().pattern(new RegExp("^[0-9]{6}$")).required().messages({
      "string.base": `Confirmation code should be a type of 'text'`,
      "string.empty": `Confirmation code cannot be an empty field`,
      "string.pattern.base": `Confirmation code must be a 6 digit number`,
      "any.required": `Confirmation code is a required field`,
    }),
  });

  const { error } = schema.validate(data);
  if (error) {
    throw new HttpError(400, error.message);
  }
  return data;
}

export async function validateUserUpdateReqBody(data: UserUpdate): Promise<UserUpdate> {
  const { error, value } = userUpdateSchema.validate(data);
  if (error) {
    throw new HttpError(400, error.message);
  }
  return value;
}

export async function isValidUUID(id: string): Promise<string> {
  const schema = Joi.string().guid().required().messages({
    "string.base": "User ID must be a valid UUID.",
    "string.guid": "User ID must be a valid UUID.",
    "string.empty": "User ID cannot be an empty field.",
    "any.required": "User ID is a required field.",
  });
  const { error, value } = schema.validate(id);
  if (error) {
    throw new HttpError(400, error.message);
  }
  return value;
}

export async function isEmailTaken(value: boolean): Promise<boolean> {
  if (value) {
    throw new HttpError(400, "Email is already exists in the system.");
  }
  return value;
}

export async function isValidString(value: string, valueName: string): Promise<string> {
  const schema = Joi.string()
    .required()
    .messages({
      "string.base": `${valueName} must be a string.`,
      "string.empty": `${valueName} cannot be an empty field.`,
      "any.required": `${valueName} is a required field.`,
    });
  const { error, value: validatedValue } = schema.validate(value);
  if (error) {
    throw new HttpError(400, error.message);
  }
  return validatedValue;
}

export async function isValidEmail(value: string): Promise<string> {
  const schema = Joi.string().email().required().messages({
    "string.email": "Email must be a valid email.",
    "string.empty": "Email cannot be an empty field.",
    "any.required": "Email is a required field.",
  });
  const { error, value: validatedValue } = schema.validate(value);
  if (error) {
    throw new HttpError(400, error.message);
  }
  return validatedValue;
}
