import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/globalMiddleware.js";
import v1Router from "./routes/v1/index.js";
import config from "./config/index.js";
import { corsOptions, credentials } from "./config/cors.js";
import cors from "cors";

const app = express();

// Enable CORS with options
app.use(cors(corsOptions));
// Use the credentials middleware
app.use(credentials);
// Disable the default 'X-Powered-By' header
app.disable("x-powered-by");

// Middleware to parse incoming requests
app.use(express.json());
// Middleware to parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
// Middleware to serve static files from the 'public' folder
app.use(express.static("public"));

// Route handler for the test endpoint
app.get("/test", (req: Request, res: Response) => {
  res.send({ message: 'Admin Building Microservice working fine.....' });
});

// Mount the routes
// TODO: Add the routes to the app
app.use("/api/v1/admin/buildings", v1Router);

app.use(errorHandler);

app.listen(config.port, config.host, () => {
  // eslint-disable-next-line no-console
  console.log(`[ ready ] http://${config.host}:${config.port}`);
});
