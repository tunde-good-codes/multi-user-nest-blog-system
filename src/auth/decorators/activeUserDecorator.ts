import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { REQUEST_USER_KEY } from "../constants/auth.constants";
import { ActiveUserData } from "../interfaces/activeUserDataInterface";

export const ActiveUser = createParamDecorator(
  (
    field: keyof ActiveUserData | undefined,
    ctx: ExecutionContext
  ): ActiveUserData | ActiveUserData[keyof ActiveUserData] | undefined => {
    const request = ctx.switchToHttp().getRequest<{ [REQUEST_USER_KEY]?: ActiveUserData }>();
    const user = request[REQUEST_USER_KEY];

    // If a user passes a field to the decorator use only that field
    return field ? user?.[field] : user;
  }
);
