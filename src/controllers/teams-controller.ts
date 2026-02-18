import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/app-error"
import { Request, Response } from "express"
import z from "zod"

class TeamsController {
  async create(request: Request, response: Response) {

    const bodySchema = z.object({
      name: z.string().max(100),
      description: z.string()
    })

    const { description, name } = bodySchema.parse(request.body)

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

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const bodySchema = z.object({
      name: z.string().max(100),
      description: z.string()
    })

    const { id } = paramsSchema.parse(request.params)
    const { description, name } = bodySchema.parse(request.body)

    await prisma.team.update({
      data: {
        description, name
      },
      where: {
        id
      }
    })

    return response.json()

  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    const teamToDelete = await prisma.team.findUnique({
      where: { id }
    })

    if (!teamToDelete) {
      throw new AppError("Time já foi deletado", 400)
    }

    await prisma.team.delete({
      where:
        { id }
    })

    return response.json({ message: "Time deletado com sucesso" })
  }
}

export { TeamsController }