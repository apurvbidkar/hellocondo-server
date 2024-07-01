import { Response } from "express";
import { RequestWithLoggedInUser, resStatusType } from "../types/index.js";
import { performEmailSearch } from "../services/user.services.js";
import { isEmailTaken, isValidString } from "../validators/index.js";

/**
 * Checks the availability of an email ID by performing a database search and validating the result.
 *
 * @param {RequestWithLoggedInUser} req - The request object, including the logged-in user's information and email to check.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A promise that resolves with a response indicating whether the email is available.
 * @throws {HttpError} Throws an error if the email search or validation fails.
 */
export async function checkEmailAvailability(req: RequestWithLoggedInUser, res: Response): Promise<Response> {
  try {
    const email = req.body.email as string;
    await isValidString(email, "Email");
    const userExists = await performEmailSearch(email);

    await isEmailTaken(userExists);

    res.status(200).json({ status: resStatusType.Success, message: "Email is available." });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({ status: resStatusType.Failed, message: error.message });
  }
}
