import { PrismaClient } from '@prisma/client';
import { decodeAuthHeader } from './util/auth';
import { HTTPGraphQLRequest } from '@apollo/server';
import { Request } from 'express';
export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: number;
}

export const context = async (headers: string): Promise<Context> => {
  const token = headers.length > 0 ? decodeAuthHeader(headers) : null;

  return {
    prisma,
    userId: token?.userId
  };
};
