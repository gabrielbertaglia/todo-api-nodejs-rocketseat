import { TaskHistoryController } from '@/controllers/task-history-controller'
import { Router } from 'express'

const tasksHistoryRoutes = Router()

const tasksHistoryController = new TaskHistoryController()

tasksHistoryRoutes.get('/:id', tasksHistoryController.index)

export { tasksHistoryRoutes }
