class HttpError extends Error {
    statusCode: number;
    body: any;
    constructor(statusCode: number, message: string, body?: any) {
      super(message);
      this.statusCode = statusCode;
      this.body = JSON.stringify(body) || JSON.stringify({ status: "failed", message });
    }
  }
  
  export { HttpError };
  