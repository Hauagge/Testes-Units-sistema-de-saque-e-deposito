
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";


let usersRepositoryInMemory: InMemoryUsersRepository ;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate  an user", async () => {
    const user:ICreateUserDTO = {
      name:"Jhon Doe",
      email: "jhondoe@teste.com",
      password: "123456"
    }

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email:user.email,
      password:user.password
    })
    console.log(result)

    expect(result).toHaveProperty("token")
  });

  it("should not be able to authenticate with unexisting e-mail", async () => {

    expect(async () => {
       await authenticateUserUseCase.execute({
        email:"non-existing email",
        password:"non-existing acount"
      })
    }).rejects.toBeInstanceOf(AppError)

  });

  it("should not be able to authenticate with incorrect password", async () => {

    expect(async () => {
      const user = {
        name:"Jhon Doe",
        email: "jhondoe@teste.com",
        password: "123456"
      }

      await  createUserUseCase.execute(user);

       await authenticateUserUseCase.execute({
        email:user.email,
        password:"wrong-password"
      })
    }).rejects.toBeInstanceOf(AppError)

  });
})
