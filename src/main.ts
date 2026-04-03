import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // CRITICAL: Enables automatic type transformation
      transformOptions: {
        enableImplicitConversion: true // Helps with query params
      },
      whitelist: true,
      forbidNonWhitelisted: false // Set to false for query params. if you include values not in dto in the body it'd throw error
    })
  );
  /**
   * swagger configuration
   */

  const config = new DocumentBuilder()
    .setVersion("1.0")
    .setTitle("NestJs Masterclass  - Blog API")
    .setDescription("the base url for this app is https://localhost:3000")
    .setTermsOfService("http://localhost:3000/terms-of-service")
    .build();
  /**
   * instantiate document
   */

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
