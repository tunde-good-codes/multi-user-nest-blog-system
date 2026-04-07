import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  public helloWorld() {
    return "hello world!";
  }
}
