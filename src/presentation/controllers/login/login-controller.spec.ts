import {
  HttpRequest,
  Authentication,
  EmailValidator,
} from "../login/login-protocols";
import { LoginController } from "./login-controller";
import {
  badRequest,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../errors";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAuthStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new AuthenticationStub();
};

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: "email@email.com",
    password: "any_password",
  },
});
interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthStub();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

describe("Login Controller", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: "email@email.com",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("Should return 400 if invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("Should call EmailValidator with correct email ", async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    await sut.handle(makeFakeHttpRequest());
    expect(isValidSpy).toHaveBeenCalledWith("email@email.com");
  });

  test("Should return 500 if EmailValidator throws ", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = await sut.handle(makeFakeHttpRequest());
    expect(promise).toEqual(serverError(new Error()));
  });

  test("Should call Authentication with correct values ", async () => {
    const { sut, authenticationStub } = makeSut();

    const spy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(makeFakeHttpRequest());
    expect(spy).toHaveBeenCalledWith("email@email.com", "any_password");
  });

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)));
    const promise = await sut.handle(makeFakeHttpRequest());
    expect(promise).toEqual(unauthorized());
  });

  test("Should return 500 if Authentication throws ", async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = await sut.handle(makeFakeHttpRequest());
    expect(promise).toEqual(serverError(new Error()));
  });
});
