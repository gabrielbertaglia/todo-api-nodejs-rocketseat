import { Request, Response } from 'express'

class SessionsController {

  create(request: Request, response: Response) {
    return response.json({ message: 'SessionsController' })
  }
}

export { SessionsController }