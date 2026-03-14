import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map, Observable } from "rxjs";

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DataResponseInterceptor.name);

  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.debug("Before");

    return next.handle().pipe(
      map((data) => ({
        success: true,
        apiVersion: this.configService.get("appConfig.apiVersion") as string,
        timestamp: new Date().toISOString(),
        data: data as Record<string, unknown>
      }))
    );
  }
}
