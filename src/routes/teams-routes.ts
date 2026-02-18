import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorizations } from "@/middlewares/verifyUserAuthorization";

const teamsRoutes = Router();

const teamsController = new TeamsController()


teamsRoutes.use(ensureAuthenticated)

teamsRoutes.use(verifyUserAuthorizations(['admin']))
teamsRoutes.post('/', teamsController.create)


export { teamsRoutes }