import { Request, Response, NextFunction } from "express";
import config from "./index.js";

const allowedOrigins = config.corsOrigins;
// CORS options with dynamic origin
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

export const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", origin); // Set to the origin instead of "true"
  }
  next();
};