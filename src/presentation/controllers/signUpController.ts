import { HttpResponse, HttpRequest } from "../protocols/http";
import { badRequest } from "../helpers/http-helper";
import { MissingParamError } from "../errors/missing-param-error";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { InvalidParamError } from "../errors/invalid-param-error";
import { ServerError } from "../errors/server-error";
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
      return {
        statusCode: 500,
        body: new ServerError(),
      };
    }
  }
}
