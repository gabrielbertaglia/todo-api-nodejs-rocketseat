import { Request, Response } from 'express';
import { z } from 'zod';

class UsersController {
  create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2).max(100),
      email: z.string().email().max(150),
      password: z.string().min(6).max(255),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    return response.json({message: "Ok"})
  }
}

export { UsersController }