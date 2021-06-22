import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import {OperationType }from "../../entities/Statement"


let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository

describe("Get balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase( statementRepositoryInMemory , usersRepositoryInMemory)
  });

  it("should be able to get user's balance", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Jhon Doe",
      email: "jhondoe@teste.com",
      password: "123456"
    }
    )

    await statementRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount:2000,
      description:"Salary"

      })

      await statementRepositoryInMemory.create({
        user_id:user.id,
        type: OperationType.WITHDRAW,
        amount:200,
        description:"Food"

        })

      const transaction = await getBalanceUseCase.execute({
        user_id:user.id
      })

    expect(transaction.balance).toBe(1800)
  });

  it("should not to be able to do get balance from an inexistent user", async () => {

    expect(async ()=>{

      await  getBalanceUseCase.execute({
        user_id:'non-existin-user'})

    }).rejects.toBeInstanceOf(AppError);

  })

})
