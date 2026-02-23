import { app } from '@/app'
import { prisma } from '@/database/prisma'
import request from 'supertest'

describe('TeamsController', () => {
  let accessToken: string

  beforeAll(async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: 'gabriel@email.com',
      password: '123456',
    })

    accessToken = sessionResponse.body.accessToken
  })

  afterAll(async () => {
    await prisma.team.deleteMany({
      where: { name: 'Test Name' },
    })
  })

  it('should create a team', async () => {
    const teamsResponse = await request(app).post('/teams')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test Name',
        description: 'Test Description',
      })

    expect(teamsResponse.status).toBe(201)
  })
})
