import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Middleware to validate UUID
export const isValidUUID = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.string()
      .uuid()
      .required()
      .messages({
        "string.base": `${paramName} must be a valid UUID.`,
        "string.guid": `${paramName} must be a valid UUID.`,
        "string.empty": `${paramName} cannot be an empty field.`,
        "any.required": `${paramName} is a required field.`,
      });
    const value = req.params[paramName] || req.body[paramName] || req.query[paramName];
    const { error } = schema.validate(value);
    if (error) {
      return res.status(400).json({ status: "failed", message: error.message || "Please enter valid UUID" });
    }
    next();
  };
};

// Middleware to validate string
export const isValidString = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.string()
      .required()
      .messages({
        "string.base": `${paramName} must be a string.`,
        "string.empty": `${paramName} cannot be an empty field.`,
        "any.required": `${paramName} is a required field.`,
      });
    const value = req.params[paramName] || req.body[paramName] || req.query[paramName];
    const { error } = schema.validate(value);
    if (error) {
      return res
        .status(400)
        .json({ status: "failed", message: error?.message || `${paramName} must be a non-empty string` });
    }
    next();
  };
};

// Middleware to validate email
export const isValidEmail = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.string()
      .email()
      .required()
      .messages({
        "string.base": `${paramName} must be a valid email.`,
        "string.email": `${paramName} must be a valid email.`,
        "string.empty": `${paramName} cannot be an empty field.`,
        "any.required": `${paramName} is a required field.`,
      });
    const value = req.params[paramName] || req.body[paramName] || req.query[paramName];
    const { error } = schema.validate(value);
    if (error) {
      return res.status(400).json({ status: "failed", message: error?.message || `${paramName} is not a valid email` });
    }
    next();
  };
};
