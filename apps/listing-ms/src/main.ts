import cors from "cors";
import express, { Request, Response } from "express";
import config from "./config/index.js";
import { errorHandler } from "./middlewares/globalMiddleware.js";
import v1Router from "./routes/v1/index.js";
const app = express();

// Disable the default 'X-Powered-By' header
app.disable("x-powered-by");

// Middleware to parse incoming requests
app.use(express.json());
// Middleware to parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
// Middleware to serve static files from the 'public' folder
app.use(express.static("public"));

// Apply CORS middleware
app.use(cors({
  origin: '*', // Adjust this to match your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent
}));

// Route handler for the test endpoint
app.get("/test", (req: Request, res: Response) => {
  res.send({ message: 'Listing Microservice working fine.....' });
});

// Mount the routes
// TODO: Add the routes to the app
app.use("/api/v1", v1Router);

app.use(errorHandler);

app.listen(config.port, config.host, () => {
  // eslint-disable-next-line no-console
  console.log(`[ ready ] http://${config.host}:${config.port}`);
});
