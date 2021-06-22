import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { AppError } from "../../../../shared/errors/AppError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {OperationType }from "../../entities/Statement"

let getOperationStatementUseCase: GetStatementOperationUseCase
let inMemoryUsersRepository:InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getOperationStatementUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository)
  });
  it("should be able to get an statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Jhon Doe",
      email: "jhondoe@teste.com",
      password: "123456"
    })

     const statement = await inMemoryStatementsRepository.create({
      user_id:user.id,
      type: OperationType.DEPOSIT,
      amount:2000,
      description:"Salary"
      })
      const operation =  await getOperationStatementUseCase.execute({
        user_id:user.id,
        statement_id:statement.id
      })
    expect(operation.amount).toBe(2000);
    expect(operation.description).toBe('Salary');



  });

  it("should not to be able to get an operation with a non existing account", async () => {

    expect(async ()=>{

      const user = await inMemoryUsersRepository.create({
        name: "Jhon Doe",
        email: "jhondoe@teste.com",
        password: "123456"
      })

      const statement = await inMemoryStatementsRepository.create({
        user_id:user.id,
        type: OperationType.DEPOSIT,
        amount:2000,
        description:"Salary"
        })

      await getOperationStatementUseCase.execute({
        user_id:'non-existing',
        statement_id:statement.id
      })

    }).rejects.toBeInstanceOf(AppError);

  });

  it("should not to be able to get an operation with a non existing operation", async () => {

    expect(async ()=>{

      const user = await inMemoryUsersRepository.create({
        name: "Jhon Doe",
        email: "jhondoe@teste.com",
        password: "123456"
      })

      await getOperationStatementUseCase.execute({
        user_id:user.id,
        statement_id:'non-existing'
      })

    }).rejects.toBeInstanceOf(AppError);

  });

})
