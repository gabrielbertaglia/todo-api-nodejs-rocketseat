import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/app-error'
import { Request, Response } from 'express'
import z from 'zod'

class TaskHistoryController {
  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findUnique({
      where: { id },
    })

    console.log('task', task)

    if (!task) {
      throw new AppError('Task não encontrada', 404)
    }

    const taskHistory = await prisma.taskHistory.findMany({
      where: {
        taskId: id,
      },
      select: {
        newStatus: true,
        oldStatus: true,
        changedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        changedAt: 'desc',
      },
    })

    return response.json(taskHistory)
  }
}

export { TaskHistoryController }
