import { app } from '@/app'
import { prisma } from '@/database/prisma'
import request from 'supertest'
import { Team, Task } from '@prisma/client'

type TeamResponse = request.Response & { body: Team }
type TaskResponse = request.Response & { body: Task }

describe("TasksController", () => {
  let accessToken: string

  let newUserId: string

  let teamResponse: TeamResponse

  let taskResponse: TaskResponse

  beforeAll(async () => {
    const sessionResponse = await request(app).post("/sessions").send({
      email: "gabriel@email.com",
      password: "123456"
    })

    const newUser = await request(app).post("/users").send({
      name: "User Test",
      email: "user_test@email.com",
      password: "123456"
    })

    const teamsResponse = await request(app).post("/teams")
      .set("Authorization", `Bearer ${sessionResponse.body.accessToken}`)
      .send({
        name: "Time de Desenvolvimento",
        description: "Descrição do time de teste"
      })

    teamResponse = teamsResponse

    newUserId = newUser.body.id

    accessToken = sessionResponse.body.accessToken

  })

  afterAll(async () => {
    await prisma.task.delete({
      where: {
        id: taskResponse.body.id
      }
    })

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: teamResponse.body.id,
          userId: newUserId
        }
      }
    })

    await prisma.user.delete({
      where: { id: newUserId }
    })

    await prisma.team.delete({
      where: {
        id: teamResponse.body.id
      }
    })
  })

  it("should throw error user not pertence a team", async () => {

    const tasksResponse = await request(app).post('/tasks')
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Test Task Name",
        description: "Test Task Description",

        status: "pending",
        priority: "high",
        teamId: teamResponse.body.id,
        userId: newUserId

      })

    expect(tasksResponse.status).toBe(400)
    expect(tasksResponse.body.message).toEqual("Usuário não pertence a esse time.")
  })

  it("should create a task when user belongs to the team", async () => {

    const teamMemberResponse = await request(app)
      .post("/team-members")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        teamId: teamResponse.body.id,
        userIds: [newUserId]
      })

    expect(teamMemberResponse.status).toBe(201)
    expect(teamMemberResponse.body.message).toBe("Membros adicionados com sucesso")

    const tasksResponse = await request(app).post("/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Nova Tarefa para teste",
        description: "Descrição para teste",
        status: "pending",
        priority: "high",
        teamId: teamResponse.body.id,
        userId: newUserId
      })

    taskResponse = tasksResponse

    expect(tasksResponse.status).toBe(201)
    expect(tasksResponse.body).toHaveProperty("id")
  })

})