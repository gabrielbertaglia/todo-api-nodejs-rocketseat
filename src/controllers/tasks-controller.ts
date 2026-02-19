import { Request, Response } from "express";
import { TaskPriority, TaskStatus } from "@prisma/client"


import z from "zod";
import { AppError } from "@/utils/app-error";
import { userSafeSelect } from "@/utils/user-safe-select";
import { prisma } from "@/database/prisma";

class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().max(200),
      description: z.string().optional(),

      status: z.nativeEnum(TaskStatus),
      priority: z.nativeEnum(TaskPriority),

      teamId: z.string().uuid(),
      userId: z.string().uuid(),

    })

    const { title, priority, status, description, teamId, userId } = bodySchema.parse(request.body)

    const loggedUserId = request.user?.id

    const memberShip = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: loggedUserId
      }
    })

    if (!memberShip) {
      throw new AppError("Você não pertence a esse time.")
    }

    const targetUser = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId
      }
    })

    if (!targetUser) {
      throw new AppError("Usuário não pertence a esse time.")
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        teamId,
        userId
      }
    })

    return response.status(201).json(task)

  }

  async index(request: Request, response: Response) {
    const schemaParams = z.object({
      teamId: z.string().uuid()
    })

    const { teamId } = schemaParams.parse(request.params)

    const tasks = await prisma.task.findMany({
      where: {
        teamId: teamId
      },
    })

    response.json(tasks)
  }

  async update(request: Request, response: Response) {
    const schemaParams = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      title: z.string().max(100),
      description: z.string().max(100).optional(),
      status: z.nativeEnum(TaskStatus),
      priority: z.nativeEnum(TaskPriority)
    })

    const { id } = schemaParams.parse(request.params)
    const { priority, status, title, description } = bodySchema.parse(request.body)

    const updated = await prisma.task.update({
      where: {
        id
      },
      data: {
        description,
        priority,
        status,
        title
      }
    })

    response.json(updated)
  }
}

export { TasksController }