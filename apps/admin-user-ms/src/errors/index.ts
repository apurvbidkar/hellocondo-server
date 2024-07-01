class HttpError extends Error {
  statusCode: number;
  body: unknown;
  constructor(statusCode: number, message: string, body?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.body = JSON.stringify(body) || JSON.stringify({ status: "failed", message });
  }
}

export { HttpError };

export const errorMessages = {
  unverifiedUserCognito:
    "Cannot reset password for the user as there is no registered/verified email or phone number. Please contact support.",
  userNotFoundCognito: "User not found in cognito",
};
