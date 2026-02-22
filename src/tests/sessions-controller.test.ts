import { app } from '@/app'
import { prisma } from '@/database/prisma'
import request from 'supertest'

describe("SessionsController", () => {

  let user_id: string

  afterAll(async () => {
    await prisma.user.delete({
      where: { id: user_id }
    })
  })

  it("should authenticate and get access token", async () => {
    const userResponse = await request(app).post('/users').send({
      name: "Auth Test User",
      email: "auth_test_user@teste.com",
      password: "teste123"
    })

    user_id = userResponse.body.id

    const sessionResponse = await request(app).post("/sessions").send({
      email: "auth_test_user@teste.com",
      password: "teste123"
    })

    expect(sessionResponse.status).toBe(200)
    expect(sessionResponse.body.accessToken).toEqual(expect.any(String))
  })
})