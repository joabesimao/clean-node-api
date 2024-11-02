import { HttpResponse, HttpRequest } from "../protocols/http";
import { badRequest, serverError } from "../helpers/http-helper";
import { MissingParamError, InvalidParamError } from "../errors";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
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
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return serverError();
    }
  }
}
