import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/app-error'
import { Request, Response } from 'express'
import z from 'zod'

class TeamMembersController {
  async create(request: Request, response: Response) {
    console.log('request.params', request.params)
    const bodySchema = z.object({
      teamId: z.string().uuid(),
      userIds: z.array(z.string().uuid()).min(1),
    })

    const { teamId, userIds } = bodySchema.parse(request.body)

    const teamsExists = await prisma.team.findUnique({
      where: { id: teamId },
    })

    console.log('teamsExists', teamsExists)

    if (!teamsExists) {
      throw new AppError('Time não encontrado', 404)
    }

    await prisma.teamMember.createMany({
      data: userIds.map(userId => ({
        teamId,
        userId,
      })),
      skipDuplicates: true,
    })

    return response.status(201).json({
      message: 'Membros adicionados com sucesso',
    })
  }

  async deleteMember(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamId: z.string().uuid(),
      userId: z.string().uuid(),
    })

    const { teamId, userId } = paramsSchema.parse(request.params)

    const teamExists = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    })

    if (!teamExists) {
      throw new AppError('Time não encontrado', 404)
    }

    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    })

    if (!member) {
      throw new AppError('Membro não encontrado no time', 404)
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    })

    return response.json({
      message: 'Membro removido com sucesso',
    })
  }

  async listMembersByTeam(request: Request, response: Response) {
    const schemaParams = z.object({
      teamId: z.string().uuid(),
    })

    const { teamId } = schemaParams.parse(request.params)

    const teamsExists = await prisma.team.findUnique({
      where: { id: teamId },
    })

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        teamMembers: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    })

    const formattedResponse = {
      id: team?.id,
      name: team?.name,
      description: team?.description,
      createdAt: team?.createdAt,
      updatedAt: team?.updatedAt,
      members: team?.teamMembers.map(member => member.user),
    }

    if (!teamsExists) {
      throw new AppError('Time não encontrado', 404)
    }

    response.json(formattedResponse)
  }
}

export {
  TeamMembersController,
}
