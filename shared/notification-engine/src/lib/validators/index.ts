import { HttpError } from "../errors/index.js";

/**
 * Validates if the provided email address is in a valid format.
 *
 * @param {string} value - The email address to validate.
 * @throws {HttpError} Throws an error if the email address is invalid.
 */
export async function isValidEmail(value: string): Promise<void> {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!value.match(regex)) {
    throw new HttpError(400, `Invalid email: ${value}`);
  }
}

/**
 * Validates a list of email addresses and ensures they are in a valid format.
 *
 * @param {string[]} emails - The list of email addresses to validate.
 * @throws {HttpError} Throws an error if any email address in the list is invalid.
 */
export async function validateBulkEmails(emails: string[]): Promise<void> {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const invalidEmails = emails.filter((email) => !email.match(regex));
  if (invalidEmails.length > 0) {
    throw new HttpError(400, `Invalid emails: ${invalidEmails.join(", ")}`);
  }
}
