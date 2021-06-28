import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'

import createConection from "../../../../database"
import { AppError } from '../../../../shared/errors/AppError';

let connection:Connection;

describe("Create User Controller",()=>{


  beforeAll(async ()=>{
    connection = await createConection();
    await connection.runMigrations()
  });

  afterAll(async()=>{
    await connection.dropDatabase();
    await connection.close()
  });

  it("Should be able to create a user", async ()=>{
    const response = await request(app).post("/api/v1/users")
    .send({
      name:"John DOe",
      email:"johndoe@hotmail.com",
      password:"123123"
    });
    console.log(response.text)

    expect(response.statusCode).toBe(201)
  })


  it("Should not be able to create a user with a email already existent", async ()=>{
    await request(app).post("/api/v1/users")
    .send({
      name:"John DOe",
      email:"johndoe@hotmail.com",
      password:"123123"
    });

    const response =  await request(app).post("/api/v1/users")
    .send({
      name:"John DOe",
      email:"johndoe@hotmail.com",
      password:"123123"
    });
    expect(response.statusCode).toBe(400)
  })


})
