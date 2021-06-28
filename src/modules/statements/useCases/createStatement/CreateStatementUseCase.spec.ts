import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { AppError } from "../../../../shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {OperationType }from "../../entities/Statement"

let createStatementUseCase: CreateStatementUseCase
let inMemoryUsersRepository:InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository)
  });
  it("should be able to do a deposit", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Jhon Doe",
      email: "jhondoe@teste.com",
      password: "123456"
    })

    const deposit = await createStatementUseCase.execute({
      user_id:user.id,
      type: OperationType.DEPOSIT,
      amount:2000,
      description:"Salary"

      })
    expect(deposit.amount).toBe(2000);

  });

  it("should not to be able to do a deposit with a non existing account", async () => {

    expect(async ()=>{

      await createStatementUseCase.execute({
        user_id:'non-existing',
        type: OperationType.DEPOSIT,
        amount:2000,
        description:"Salary"

        })

    }).rejects.toBeInstanceOf(AppError);

  });

  it("should be able to do a withdraw", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Jhon Doe",
      email: "jhondoe@teste.com",
      password: "123456"
    })

     await createStatementUseCase.execute({
      user_id:user.id,
      type: OperationType.DEPOSIT,
      amount:2000,
      description:"Salary"

      })

      const withdraw = await createStatementUseCase.execute({
        user_id:user.id,
        type: OperationType.WITHDRAW,
        amount:200,
        description:"Food"

        })
    expect(withdraw.amount).toBe(200);
    expect(withdraw.description).toBe("Food");

  });


  it("should not to be able to do a withdraw with insufficient fund", async () => {

    expect(async ()=>{

      await createStatementUseCase.execute({
        user_id:'non-existing',
        type: OperationType.WITHDRAW,
        amount:200,
        description:"Food"

        })

    }).rejects.toBeInstanceOf(AppError);

  });



})
