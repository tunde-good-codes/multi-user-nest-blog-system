import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "src/user/userEntity";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserWelcome(user: User): Promise<{ success: boolean; info?: any; error?: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.mailerService.sendMail({
        to: user.email,
        from: "onboarding team mail message <support@nestjs-blog.com>",
        subject: "Welcome to NestJS!",
        template: "./welcome",
        context: {
          name: user.firstName,
          email: user.email,
          loginUrl: "https://localhost:3000"
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
