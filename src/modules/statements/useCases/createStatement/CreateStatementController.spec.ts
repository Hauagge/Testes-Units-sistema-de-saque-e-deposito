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


  beforeAll(async ()=>{
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

     token  =  responseToken.body.token;


  });

  afterAll(async()=>{
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to do a deposit", async ()=>{
    const response = await request(app).post('/api/v1/statements/deposit')
    .send({
      amount:100.00,
      description:'Salario'
    })
    .set({
      Authorization:`Bearer ${token}`
    });

   expect(response.body.amount).toBe(100.00);
   expect(response.body.description).toBe('Salario');

  })

  it("Should be able to do a withdraw", async ()=>{

    await request(app).post('/api/v1/statements/deposit')
    .send({
      amount:300.00,
      description:'Salario'
    })
    .set({
      Authorization:`Bearer ${token}`
    });

    const response = await request(app).post('/api/v1/statements/withdraw')
    .send({
      amount:300.00,
      description:'Mercado'
    })
    .set({
      Authorization:`Bearer ${token}`
    });

   expect(response.body.amount).toBe(300.00);
   expect(response.body.description).toBe('Mercado');

  });

  it("Should not be able to do a withdraw with insuficient fund", async ()=>{

    await request(app).post('/api/v1/statements/deposit')
    .send({
      amount:200,
      description:'initiate'
    })
    .set({
      Authorization:`Bearer ${token}`
    });

    const response =   await request(app).post('/api/v1/statements/withdraw')
    .send({
      amount:900,
      description:'not enough fund'
    })
    .set({
      Authorization:`Bearer ${token}`
    });


   expect(response.status).toBe(401);

  });

  it("Should not be able to create a statement with a unexisting user", async ()=>{
    const nonexistent_user_id = uuidv4();
    const nonexistent_user_token = sign({}, auth.jwt.secret, {
      subject: nonexistent_user_id,
      expiresIn: auth.jwt.expiresIn
    });
    const response = await request(app).post('/api/v1/statements/deposit')
    .send({
      amount:300.00,
      description:'Mercado'
    })
    .set({
      Authorization: `Bearer ${nonexistent_user_token}`
    });

   expect(response.statusCode).toBe(404);
   expect(response.body.message).toBe('User not found');

  });




})
