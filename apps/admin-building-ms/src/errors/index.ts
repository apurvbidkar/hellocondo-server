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
