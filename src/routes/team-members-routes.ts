import { TeamMembersController } from "@/controllers/team-members-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorizations } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const teamMembersRoutes = Router()

const teamMembersController = new TeamMembersController()

teamMembersRoutes.use(ensureAuthenticated, verifyUserAuthorizations(['admin']))
teamMembersRoutes.post('/', teamMembersController.create)


export { teamMembersRoutes }