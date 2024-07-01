import { Response, NextFunction } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import config from "./../config/index.js";
import { RequestWithLoggedInUser } from "../types/index.js";
import { createUserContext } from "../services/user.services.js";
import { HttpError } from "../errors/index.js";

const userPoolId = config.cognito.userPoolId;
const region = config.cognito.region;
const iss = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

interface Jwk {
  kid: string;
  kty: "RSA";
  n: string;
  e: string;
}

const pems: { [key: string]: string } = {};

const getPems = async (): Promise<{ [key: string]: string }> => {
  if (Object.keys(pems).length > 0) return pems;

  const url = `${iss}/.well-known/jwks.json`;
  const response = await axios.get(url);
  const { keys } = response.data;

  keys.forEach((key: Jwk) => {
    const keyId = key.kid;
    const jwk = { kty: key.kty, n: key.n, e: key.e };
    pems[keyId] = jwkToPem(jwk);
  });

  return pems;
};

const verifyToken = async (token: string): Promise<JwtPayload> => {
  try {
    const pems = await getPems();
    const decodedJwt = jwt.decode(token, { complete: true }) as jwt.Jwt & { header: { kid: string } };
    if (!decodedJwt) throw new HttpError(401, "Unauthorized", { status: "failed", message: "Unauthorized" });
    const kid = decodedJwt.header.kid;
    const pem = pems[kid];
    if (!pem) throw new HttpError(401, "Unauthorized", { status: "failed", message: "Unauthorized" });
    const decodedToken = jwt.verify(token, pem, { issuer: iss }) as JwtPayload;
    return decodedToken;
    // TODO: need to remove
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpError(401, error.message === "jwt expired" ? "Unauthorized" : error?.message || "Unauthorized", {
      status: "failed",
      message: error.message === "jwt expired" ? "Unauthorized" : error?.message || "Unauthorized",
    });
  }
};

/* const decodeIdToken = (idToken: string): UserCtx => {
  try {
    const decodedToken = jwt.decode(idToken) as JwtPayload;
    const { email, name } = decodedToken;
    const roleId = decodedToken?.["custom:roleId"];
    const userName = decodedToken?.["cognito:username"];

    return { email, name, roleId, userName };
  } catch (error) {
    throw new HttpError(401, "id Token was not provided", {
      status: "failed",
      message: "id Token was not provided",
    });
  }
};
 */

const cognitoAuthMiddleware = async (req: RequestWithLoggedInUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const idToken = req.headers.idtoken as string;

  if (!authHeader) {
    return res.status(401).json({ status: "failed", message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: "failed", message: "Unauthorized" });
  }

  try {
    const decodedToken = await verifyToken(token);
    const user = await createUserContext(decodedToken.sub);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ status: "failed", message: error.message || "Unauthorized" });
  }
};

export { cognitoAuthMiddleware, verifyToken };
