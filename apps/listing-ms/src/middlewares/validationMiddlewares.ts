import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const footerNeighborhoodReqSchema = Joi.object({
  latitude: Joi.number().required().min(-90).max(90).precision(6).messages({
    "number.min": "Latitude must be at least -90.",
    "number.max": "Latitude cannot exceed 90.",
    "number.base": "Latitude must be a valid number.",
    "number.precision": "Latitude cannot have more than 6 decimal places.",
    "any.required": "Latitude is a required field.",
  }),
  longitude: Joi.number().required().min(-180).max(180).precision(6).messages({
    "number.min": "Longitude must be at least -180.",
    "number.max": "Longitude cannot exceed 180.",
    "number.base": "Longitude must be a valid number.",
    "number.precision": "Longitude cannot have more than 6 decimal places.",
    "any.required": "Longitude is a required field.",
  }),
  distance: Joi.number().default(3).min(1).max(100).messages({
    "number.base": "Distance must be a valid number.",
    "number.min": "Distance must be at least 1.",
    "number.max": "Distance cannot exceed 100.",
  }),
  limit: Joi.number().default(3).min(1).max(20).allow(-1).messages({
    "number.base": "Limit must be a valid number.",
    "number.max": "Limit cannot exceed 20.",
    "number.min": "Limit must be at least 1.",
  }),
  state: Joi.string().trim().required().min(2).max(2).messages({
    "string.min": "State must be a valid state code.",
    "string.max": "State must be a valid state code.",
    "any.required": "State is a required field.",
  }),
  county: Joi.string().trim().min(3).required().messages({
    "string.min": "County must be a valid county name.",
    "any.required": "County is a required field.",
  }),
  city: Joi.string().trim().min(3).messages({
    "string.min": "City must be a valid city name.",
  }),
  distanceUnit: Joi.string().valid("km", "mi", "m", "yd", "ft").default("mi").messages({
    "string.empty": "Distance unit must be one of 'km', 'mi', 'm', 'yd', 'ft'.",
    "string.valid": "Distance unit must be one of 'km', 'mi', 'm', 'yd', 'ft'.",
    "any.only": "Distance unit must be one of 'km', 'mi', 'm', 'yd', 'ft'.",
  }),
  nameOrder: Joi.string().valid("ASC", "DESC").messages({
    "string.empty": "Name order must be one of 'ASC', 'DESC'.",
    "string.valid": "Name order must be one of 'ASC', 'DESC'.",
    "any.only": "Name order must be one of 'ASC', 'DESC'.",
  }),
  zipOrder: Joi.string().valid("ASC", "DESC").messages({
    "string.empty": "Zip order must be one of 'ASC', 'DESC'.",
    "string.valid": "Zip order must be one of 'ASC', 'DESC'.",
    "any.only": "Zip order must be one of 'ASC', 'DESC'.",
  }),
});

/**
 * Middleware to validate the query parameters for a footer neighborhood and zip code request.
 *
 * This function uses Joi to validate the request's query parameters against the `footerNeighborhoodReqSchema`.
 * If the validation fails, it responds with a 400 status code and an error message.
 * If the validation passes, it attaches the validated value to `req.query` and calls the next middleware in the stack.
 *
 * @param {Request} req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @param {NextFunction} next - The callback to pass control to the next middleware function.
 */
export function validateFooterNeighborhoodReqQuery(req: Request, res: Response, next: NextFunction) {
  const { error, value } = footerNeighborhoodReqSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ status: "failed", message: error?.message || "Please enter valid UUID" });
  }
  req.query = value;
  next();
}
