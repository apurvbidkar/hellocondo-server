import Joi from "joi";
import { HttpError } from "../errors/index.js";
import { contactAgentFormBody, contactUsFormBody } from "../types/index.js";

const contactAgentSchema = Joi.object({
    additionalInfo: Joi.string(),
    address: Joi.string(),
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email.",
        "any.required": "Email is a required field.",
    }),
    inquiryType: Joi.string().valid('Buying', 'Selling', 'Buying & Selling').required().messages({
        "string.empty": "Interest must be a valid value.",
        "any.required": "Interest is a required field.",
    }),
    name: Joi.string().required().messages({
        "string.empty": "Name must be a valid value.",
        "any.required": "Name is a required field.",
    }),
    phoneNumber: Joi.string(),
    propertyType: Joi.string().valid('Any', 'Condo', 'Townhouse'),
    targetPrice: Joi.string()
})

export function validateContactAgentFormReqBody(data: contactAgentFormBody): Promise<contactAgentFormBody> {
    const { error, value } = contactAgentSchema.validate(data);
    if (error) {
        throw new HttpError(400, error.message);
    }
    return value;
}

const contactUsSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email.",
        "any.required": "Email is a required field.",
    }),
    name: Joi.string().required().messages({
        "string.empty": "Name must be a valid value.",
        "any.required": "Name is a required field.",
    }),
    phoneNumber: Joi.string(),
    message: Joi.string()
})

export function validateContactUsFormReqBody(data: contactUsFormBody): Promise<contactUsFormBody> {
    const { error, value } = contactUsSchema.validate(data);
    if (error) {
        throw new HttpError(400, error.message);
    }
    return value;
}