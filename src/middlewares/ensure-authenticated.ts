import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { authConfig } from '@/config/auth'
import { AppError } from '@/utils/app-error'

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
    const [, auth] = authHeader.split(' ')

    const { role, sub: userId } = verify(auth, authConfig.jwt.secret) as ITokenPayload

    request.user = {
      id: userId,
      role,
    }

    return next()
  } catch (_error) {
    throw new AppError('Invalid JWT token', 401)
  }
}

export { ensureAuthenticated }
