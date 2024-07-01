export interface IDTokenResponse {
  sub: string;
  emailVerified: boolean;
  iss: string;
  username: string;
  originJti: string;
  aud: string | string[];
  eventId: string;
  tokenUse: string;
  roleId: string;
  authTime: Date;
  name: string;
  exp: Date;
  iat: Date;
  jti: string;
  email: string;
}

export interface AccessTokenResponse {
  sub: string;
  iss: string;
  clientId: string;
  originJti: string;
  eventId: string;
  tokenUse: string;
  scope: string;
  authTime: Date;
  exp: Date;
  iat: Date;
  jti: string;
  username: string;
}

export type AccessTokenPayload = {
  accessToken: string;
  expiresIn: number;
  idToken: string;
};
