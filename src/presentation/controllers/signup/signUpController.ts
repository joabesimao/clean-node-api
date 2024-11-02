import {
  HttpResponse,
  HttpRequest,
  Controller,
  AddAccount,
  EmailValidator,
} from "./signup-protocols";
import { badRequest, serverError } from "../../helpers/http-helper";
import { MissingParamError, InvalidParamError } from "../../errors";

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requireFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      const { name, email, password, passwordConfirmation } = httpRequest.body;

      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      this.addAccount.add({
        name,
        email,
        password,
      });
    } catch (error) {
      return serverError();
    }
  }
}
