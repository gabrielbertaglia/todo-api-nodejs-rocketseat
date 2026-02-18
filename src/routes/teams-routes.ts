import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorizations } from "@/middlewares/verifyUserAuthorization";

const teamsRoutes = Router();

const teamsController = new TeamsController()

teamsRoutes.use(ensureAuthenticated, verifyUserAuthorizations(['admin']))
teamsRoutes.get('/', teamsController.index)
teamsRoutes.post('/', teamsController.create)
teamsRoutes.put('/:id', teamsController.update)
teamsRoutes.delete('/:id', teamsController.delete)

export { teamsRoutes }