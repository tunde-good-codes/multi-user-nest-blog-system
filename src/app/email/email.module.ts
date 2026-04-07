/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Global, Module } from "@nestjs/common";
// import { EmailService } from "./email.service";
// import { MailerModule } from "@nestjs-modules/mailer";
// import { ConfigService } from "@nestjs/config";
// import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
// import { join } from "path";
// @Global()
// @Module({
//   providers: [EmailService],
//   imports: [
//     MailerModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         transport: {
//           host: config.getOrThrow<string>("MAIL_HOST"),
//           secure: false,
//           port: 2525,
//           auth: {
//             user: config.getOrThrow<string>("SMTP_USERNAME"),
//             pass: config.getOrThrow<string>("SMTP_PASSWORD")
//           }
//         },
//         default: {
//           from: "my blog <no-reply@nestjs.com>"
//         },
//         template: {
//           dir: join(__dirname, "templates"),
//           adapter: new EjsAdapter({
//             inlineCssEnabled: true
//           }),
//           options: {
//             strict: false
//           }
//         }
//       })
//     })
//   ],
//   exports: [EmailService]
// })
// export class EmailModule {}

import { Global, Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { join } from "path";

@Global()
@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.getOrThrow<string>("MAIL_HOST"),
          secure: false,
          port: 2525,
          auth: {
            user: config.get<string>("SMTP_USERNAME"),
            pass: config.get<string>("SMTP_PASSWORD")
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
  ],
  exports: [EmailService]
})
export class EmailModule {}
