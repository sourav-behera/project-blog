import * as jwt from 'jsonwebtoken';
export const APP_SECRET = `${process.env.APP_SECRET}`;

export interface AuthPayloadToken {
  userId: number;
}
export function decodeAuthHeader(authHeader: string): AuthPayloadToken {
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token found');
  }
  return jwt.verify(token, APP_SECRET) as AuthPayloadToken;
}
