import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'

import createConection from "../../../../database"

let connection:Connection;

describe("Authenticate Controller",()=>{


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

  it("Should be able to Authenticate", async ()=>{

    const response = await  request(app).post('/api/v1/sessions')
    .send({
      email:"johndoe@hotmail.com",
      password:"123123"
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("token")
  })

  it("Should not be able to Authenticate with wrong password", async ()=>{
    const response = await  request(app).post('/api/v1/sessions')
    .send({
      email:"johndoe@hotmail.com",
      password:"123"
    })

    expect(response.statusCode).toBe(401)
  })

  it("Should not be able to Authenticate with wrong email", async ()=>{

    const response = await  request(app).post('/api/v1/sessions')
    .send({
      email:"janedoe@hotmail.com",
      password:"123123"
    })

    expect(response.statusCode).toBe(401)
  })


})
