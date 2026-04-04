import { Global, Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>("appConfig.mailHost"),
          secure: false,
          port: 2525,
          auth: {
            user: config.get<string>("appConfig.smtpUsername"),
            pass: config.get<string>("appConfig.smtpPassword")
          }
        },
        default: {
          from: "my blog <no-reply@nestjs.com>"
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new EjsAdapter({
            inlineCssEnabled: true
          }),
          options: {
            strict: false
          }
        }
      })
    })
  ]
})
export class EmailModule {}
