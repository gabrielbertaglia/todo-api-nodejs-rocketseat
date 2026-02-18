import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response } from "express";
import z from "zod";

class TeamMembersController {
  async create(request: Request, response: Response) {
    console.log("request.params", request.params)
    const bodySchema = z.object({
      teamId: z.string().uuid(),
      userIds: z.array(z.string().uuid()).min(1),
    })

    const { teamId, userIds } = bodySchema.parse(request.body)

    const teamsExists = await prisma.team.findUnique({
      where: { id: teamId }
    })

    console.log("teamsExists", teamsExists)

    if (!teamsExists) {
      throw new AppError("Time não encontrado", 404)
    }

    await prisma.teamMember.createMany({
      data: userIds.map(userId => ({
        teamId,
        userId
      })),
      skipDuplicates: true
    })

    return response.status(201).json({
      message: "Membros adicionados com sucesso"
    })

  }
}

export {
  TeamMembersController
}