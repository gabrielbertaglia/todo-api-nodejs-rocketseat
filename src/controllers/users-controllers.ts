import { Request, Response } from 'express';
import { hash } from 'bcrypt'
import { z } from 'zod';
import { prisma } from '@/database/prisma';
import { AppError } from '@/utils/app-error';

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2).max(100),
      email: z.string().email().max(150),
      password: z.string().min(6).max(255),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
      }
    })

    if (userAlreadyExists) throw new AppError('User already exists')

    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json(userWithoutPassword)
  }
}

export { UsersController }