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

    const result = await prisma.$transaction(async t => {
      const targetUser = await prisma.teamMember.findFirst({
        where: {
          teamId,
          userId
        }
      })

      if (!targetUser) {
        throw new AppError("Usuário não pertence a esse time.")
      }

      const task = await t.task.create({
        data: {
          title,
          description,
          priority,
          status,
          teamId,
          userId
        }
      })

      await t.taskHistory.create({
        data: {
          taskId: task.id,
          changedBy: request.user?.id!,
          oldStatus: status,
          changedAt: new Date()
        }
      })

      return task
    })

    return response.status(201).json(result)

  }

  async index(request: Request, response: Response) {
    const schemaParams = z.object({
      teamId: z.string().uuid(),
    })

    const querySchema = z.object({
      status: z.nativeEnum(TaskStatus).optional(),
      priority: z.nativeEnum(TaskPriority).optional(),
    })

    const { teamId } = schemaParams.parse(request.params)
    const { status, priority } = querySchema.parse(request.query)

    const teamExists = await prisma.team.findUnique({
      where: { id: teamId }
    })

    if (!teamExists) {
      throw new AppError("Time não encontrado", 404)
    }

    const tasks = await prisma.task.findMany({
      where: {
        teamId: teamId,
        ...(status && { status }),
        ...(priority && { priority }),
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

    const result = await prisma.$transaction(async t => {

      const existingTask = await t.task.findUnique({
        where: { id }
      })

      if (!existingTask) {
        throw new AppError("Task não encontrada.", 404)
      }

      const task = await t.task.findUnique({
        where: {
          id: id
        }
      })

      const updatedTask = await t.task.update({
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

      if (task?.status !== status) {
        await t.taskHistory.create({
          data: {
            taskId: id,
            changedBy: request.user?.id!,
            oldStatus: existingTask.status,
            newStatus: status,
            changedAt: new Date()
          }
        })
      }
      return updatedTask
    })

    response.json(result)
  }

  async delete(request: Request, response: Response) {
    const schemaParams = z.object({
      id: z.string().uuid()
    })

    const { id } = schemaParams.parse(request.params)

    const task = await prisma.task.findUnique({
      where: {
        id
      }
    })

    if (!task) {
      throw new AppError("Tarefa não existe")
    }

    await prisma.task.delete({
      where: {
        id
      }
    })

    response.status(201).json({
      message: "Tarefa excluída com sucesso"
    })
  }
}

export { TasksController }