/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "../user/entities/user.entity";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserWelcome(user: User): Promise<{ success: boolean; info?: any; error?: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

      const year = new Date().getFullYear();
      const result = await this.mailerService.sendMail({
        to: user.email,
        from: "Onboarding Team  <support@nestjs-blog.com>",

        subject: "Welcome to NestJS Blog!",
        template: "./welcome",
        context: {
          name: user.firstName,
          email: user.email,
          url: "https://localhost:3000",
          year,
          appName: "nest-js blog  testing "
        }
      });
      console.log("✅ Email sent successfully:", result);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { success: true, info: result };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("❌ Error sending email:", message);
      return { success: false, error: message };
    }
  }
}
