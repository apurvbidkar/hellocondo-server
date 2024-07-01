import { NextFunction, Request, Response } from "express";
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
