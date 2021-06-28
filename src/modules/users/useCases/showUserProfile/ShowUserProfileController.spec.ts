import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'

import createConection from "../../../../database"
import { AppError } from '../../../../shared/errors/AppError';

let connection:Connection;

describe("Show User's Profile Controller",()=>{


  beforeAll(async ()=>{
    connection = await createConection();
    await connection.runMigrations();
    await request(app).post("/api/v1/users")
    .send({
      name:"John DOe",
      email:"johndoe@hotmail.com",
      password:"123123"
    });

  })

  afterAll(async()=>{
    await connection.dropDatabase();
    await connection.close()
  })

  it("Should be able to show the user's profile", async ()=>{
    const responseToken = await  request(app).post('/api/v1/sessions')
    .send({
      email:"johndoe@hotmail.com",
      password:"123123"
    })

    const {token} = await responseToken.body
    const response = await request(app).get("/api/v1/profile")
    .set({
      Authorization:`Bearer ${token}`
    });

    expect(response.status).toBe(200)
  })


  it("Should not be able to show profile to user not logged", async ()=>{

    const response = await request(app).get("/api/v1/profile")
    .send({
      name:"John DOe",
      email:"johndoe@hotmail.com",
      password:"123123"
    })
    expect(response.status).toBe(401)
  })


})
