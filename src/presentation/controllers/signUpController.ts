import { HttpResponse, HttpRequest } from "../protocols/http";
import { badRequest } from "../helpers/http-helper";
import { MissingParamError } from "../errors/missing-param-error";
export class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requireFields = ["name", "email", "password", "passwordConfirmation"];

    for (const field of requireFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
