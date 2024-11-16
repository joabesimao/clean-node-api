import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  EmailValidator,
} from "../login/login-protocols";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../errors";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return new Promise((resolve) =>
          resolve(badRequest(new MissingParamError("email")))
        );
      }
      if (!password) {
        return new Promise((resolve) =>
          resolve(badRequest(new MissingParamError("password")))
        );
      }
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return new Promise((resolve) =>
          resolve(badRequest(new InvalidParamError("email")))
        );
      }
      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
