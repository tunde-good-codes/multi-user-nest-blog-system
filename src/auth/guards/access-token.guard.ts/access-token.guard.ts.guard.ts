import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "src/auth/config/jwt.config";
import { REQUEST_USER_KEY } from "src/auth/constants/auth.constants";

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Missing access token");
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer
      });

      // ✅ Type-safe assignment
      (request as any)[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
