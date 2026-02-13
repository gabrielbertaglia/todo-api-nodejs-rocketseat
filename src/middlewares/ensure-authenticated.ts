import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { authConfig } from "@/config/auth";
import { AppError } from "@/utils/app-error";


interface ITokenPayload {
  sub: string;
  role: 'admin' | 'member';
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      throw new AppError('JWT token not found', 401)
    }
    const [, auth] = authHeader.split(" ")

    const {role, sub: user_id} = verify(auth, authConfig.jwt.secret) as ITokenPayload

    request.user = {
      id: user_id,
      role
    }

    return next()
  } catch (error) {
    throw new AppError('Invalid JWT token', 401)
  }
}

export { ensureAuthenticated }