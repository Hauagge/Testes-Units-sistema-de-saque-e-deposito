

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import { AppError } from "../../../../shared/errors/AppError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

let showUserProfileUseCase: ShowUserProfileUseCase;


describe("Show profile user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
  });

  it("should be able to show info profile user's", async () => {
    const user = await createUserUseCase.execute({
      name: "Jhon Doe",
      email: "jhondoe@teste.com",
      password: "123456"
    }
    )
    if(!user.id){
      throw new AppError("Erro ao tentar criar usuario")
    }
    const profile = await showUserProfileUseCase.execute(user.id)

    expect(profile).toBe(user)
  });
  it("should not be able to  show a unexisting account", async () => {

    expect(async () => {
       await showUserProfileUseCase.execute('non-existin-id')

    }).rejects.toBeInstanceOf(AppError)

  });
})
