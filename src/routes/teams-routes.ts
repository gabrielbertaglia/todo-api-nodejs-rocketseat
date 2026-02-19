import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorizations } from "@/middlewares/verifyUserAuthorization";
import { teamMembersRoutes } from "./team-members-routes";
import { TeamMembersController } from "@/controllers/team-members-controller";

const teamsRoutes = Router();

const teamsController = new TeamsController()
const teamsControllerMembers = new TeamMembersController()

teamsRoutes.use(ensureAuthenticated)
teamsRoutes.get('/:teamId/members', teamsControllerMembers.listMembersByTeam)

teamsRoutes.use(ensureAuthenticated, verifyUserAuthorizations(['admin']))
teamsRoutes.get('/', teamsController.index)
teamsRoutes.post('/', teamsController.create)
teamsRoutes.put('/:id', teamsController.update)
teamsRoutes.delete('/:id', teamsController.delete)

export { teamsRoutes }