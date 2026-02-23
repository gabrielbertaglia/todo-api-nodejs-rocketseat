import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/app-error"
import { Request, Response } from "express"
import z from "zod"

class TeamsController {
  async create(request: Request, response: Response) {

    const bodySchema = z.object({
      name: z.string().min(2).max(100).trim(),
      description: z.string().optional()
    })

    const { description, name } = bodySchema.parse(request.body)

    const team = await prisma.team.create({
      data: {
        name,
        description,
      }
    })

    return response.status(201).json(team)
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
      name: z.string().min(2).max(100).trim(),
      description: z.string().optional()
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

    const team = await prisma.team.findUnique({
      where: { id }
    })

    if (!team) {
      throw new AppError("Time não encontrado", 404)
    }

    const membersCount = await prisma.teamMember.count({
      where: {
        teamId: id
      }
    })

    if (membersCount > 0) {
      throw new AppError("Não foi possível deleta o time. Existe membros vinculados a ele.")
    }

    await prisma.team.delete({
      where:
        { id }
    })

    return response.json({ message: "Time deletado com sucesso" })
  }
}

export { TeamsController }