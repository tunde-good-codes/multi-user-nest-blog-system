import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
//import { DataResponseInterceptor } from "./no-spec/common/interceptors/data-response/data-response.interceptor";
dotenv.config();

export function appCreate(app: INestApplication): void {
  app.useGlobalPipes(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    new ValidationPipe({
      whitelist: true, // any parameter not passed in dto won't be taken to the controller
      forbidNonWhitelisted: true,
      transform: true, // transform the request to an instance of the dto class
      disableErrorMessages: false,
      transformOptions: { enableImplicitConversion: true }
    })
  );
  // swagger configuration
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const configSwagger = new DocumentBuilder()
    .setTitle("NestJs Masterclass - Blog Api")
    .setDescription("use the base api url as http://localhost:3000")
    .setTermsOfService("http://localhost:3000/term-of-service")
    .setLicense("MIT License", "http://localhost:3000")
    .addServer("http://localhost:3000")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup("api", app, document);
  //enable cors
  app.enableCors();

  // use global interceptors

  // app.useGlobalInterceptors(new DataResponseInterceptor());
}
