import { TasksController } from "@/controllers/tasks-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { Router } from "express";

const tasksRoutes = Router()

const tasksController = new TasksController()

tasksRoutes.use(ensureAuthenticated)
tasksRoutes.post('/', tasksController.create)
tasksRoutes.get('/:teamId', tasksController.index)

export { tasksRoutes }