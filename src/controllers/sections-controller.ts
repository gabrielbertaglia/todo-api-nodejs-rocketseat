import { authConfig } from '@/config/auth'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/app-error'
import { compare } from 'bcrypt'
import {sign} from 'jsonwebtoken'
import { Request, Response } from 'express'
import z from 'zod'

class SessionsController {

  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: { email }
    })
    
    if(!user){
      throw new AppError('Email or password incorrect', 401)
    }
    
    const passwordMatches = await compare(password, user.password)

    if(!passwordMatches){
      throw new AppError('Email or password incorrect', 401)
    }

    const {expiresIn, secret} = authConfig.jwt

    const token = sign({role: user.role ?? 'member'}, secret, {
      subject: user.id,
      expiresIn
    })
    
    return response.json({ token })
  }
}

export { SessionsController }