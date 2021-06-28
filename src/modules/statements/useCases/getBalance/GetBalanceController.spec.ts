import request from 'supertest'
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import auth from '../../../../config/auth';

import createConection from "../../../../database"
import { AppError } from '../../../../shared/errors/AppError';

let connection:Connection;
let token:string;

describe("Create Statement Controller",()=>{


  beforeEach(async ()=>{
    connection = await createConection();
    await connection.runMigrations();
    await request(app).post('/api/v1/users')
    .send({
      name:"John DOe",
      email:"johndoe@hotmail.com",
      password:"123123"
    });

    const responseToken = await  request(app).post('/api/v1/sessions')
    .send({
      email:"johndoe@hotmail.com",
      password:"123123"
    });

     token  =  responseToken.body.token


  });

  afterEach(async()=>{
    await connection.dropDatabase();
    await connection.close()
  });

  it("Should be able to do a deposit", async ()=>{


    await request(app).post('/api/v1/statements/deposit')
    .send({
      amount:200,
      description:'initiate'
    })
    .set({
      Authorization:`Bearer ${token}`
    });

    const response = await request(app).get('/api/v1/statements/balance')
    .set({
      Authorization:`Bearer ${token}`
    });
    console.log(response.text)

  //  expect(response.body.amount).toBe(100.00)
  //  expect(response.body.description).toBe('Salario')

  })

})
