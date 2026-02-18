import { prisma } from "@/database/prisma"
import { Request, Response } from "express"
import z from "zod"

class TeamsController {
  async create(request: Request, response: Response) {

    const bodySchema = z.object({
      name: z.string().max(100),
      description: z.string()
    })

    const {description, name} = bodySchema.parse(request.body)

    await prisma.team.create({
      data: {
        name,
        description,
      }
    })

    return response.status(201).json()
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.team.findMany()

    return response.json(teams)
  }
}

export {TeamsController}