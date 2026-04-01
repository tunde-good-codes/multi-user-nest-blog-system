import { SetMetadata } from "@nestjs/common";
import { AuthType } from "../enum/auth.enum";

export const AUTH_TYPE_KEY = "authType";

export const Auth = (...authTypes: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
