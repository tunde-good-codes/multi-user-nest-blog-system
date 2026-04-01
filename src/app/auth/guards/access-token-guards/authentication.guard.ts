/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthType } from "../../enum/auth.enum";
import { Reflector } from "@nestjs/core";
import { AccessTokenGuard } from "./access-token.guard";
import { AUTH_TYPE_KEY } from "../../decorators/auth.decorators";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true }
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Print authTypeGuardMap
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass()
    ]) ?? [AuthenticationGuard.defaultAuthType];
    // Show what are authTypes

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    // print Guards => Show that the user can pass an array in users controller as well

    // Declare the default error
    let error = new UnauthorizedException();

    for (const instance of guards) {
      // print each instance
      // Decalre a new constant
      const canActivate = await Promise.resolve(
        // Here the AccessToken Guard Will be fired and check if user has permissions to acces
        // Later Multiple AuthTypes can be used even if one of them returns true
        // The user is Authorised to access the resource
        instance.canActivate(context)
      ).catch((err) => {
        error = err;
      });

      // Display Can Activate
      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
