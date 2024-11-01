import { HttpResponse, HttpRequest } from "../protocols/http";
import { MissingParamError } from "../errors/missing-param-error";
export class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.name) {
      return { statusCode: 400, body: new MissingParamError("name") };
    }
    if (!httpRequest.body.email) {
      return { statusCode: 400, body: new MissingParamError("email") };
    }
  }
}
