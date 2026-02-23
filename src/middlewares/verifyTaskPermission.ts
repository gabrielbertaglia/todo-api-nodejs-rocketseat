import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/app-error'
import { Request, Response, NextFunction } from 'express'

async function verifyTaskPermission(request: Request, response: Response, next: NextFunction) {
  const loggedUser = request.user

  if (!loggedUser) {
    throw new AppError('Unauthorized', 401)
  }

  const { id } = request.params

  if (!id) {
    throw new AppError('Tarefa precisa de id')
  }

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  })

  if (!task) {
    throw new AppError('Tarefa não encontrada', 404)
  }

  if (loggedUser.role === 'admin') {
    return next()
  }

  if (task.userId !== loggedUser.id) {
    throw new AppError('Você não tem permissão para essa tarefa', 403)
  }

  return next()
}

export { verifyTaskPermission }
