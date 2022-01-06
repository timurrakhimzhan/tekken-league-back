import { FastifyRequest } from "fastify";

export type JwtUserPayload = {
  username: string;
  iat: number;
  exp: number;
};

export type FastifyUserRequest = FastifyRequest & {
  user: JwtUserPayload;
};
