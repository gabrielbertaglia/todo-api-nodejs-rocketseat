import { Request, Response } from "express";
import { TaskPriority, TaskStatus } from "@prisma/client"


import z from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";

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
}

export { TasksController }