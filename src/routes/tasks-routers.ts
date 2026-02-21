import { TasksController } from "@/controllers/tasks-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyTaskPermission } from "@/middlewares/verifyTaskPermission";
import { verifyUserAuthorizations } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const tasksRoutes = Router()

const tasksController = new TasksController()

tasksRoutes.use(ensureAuthenticated, verifyUserAuthorizations(['admin', 'member']))
tasksRoutes.post('/', tasksController.create)
tasksRoutes.get('/:teamId', tasksController.index)
tasksRoutes.put('/:id', verifyTaskPermission, tasksController.update)
tasksRoutes.delete('/:id', verifyTaskPermission, tasksController.delete)

export { tasksRoutes }