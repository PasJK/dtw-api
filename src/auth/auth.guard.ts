import { Observable } from "rxjs";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt/jwt.guard";

@Injectable()
export class GlobalAuthGuard extends JwtAuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get<boolean>("public", context.getHandler());
        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }
}
