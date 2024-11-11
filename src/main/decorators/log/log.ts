import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const result = await this.controller.handle(httpRequest);
    return result;
  }
}
