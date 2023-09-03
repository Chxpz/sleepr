import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Inject
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE } from "../constants/services";
import { Observable, map, tap } from "rxjs";

@Injectable()
export class JWTAuthGuard implements CanActivate {

    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) { }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
        if (!jwt) {
            return false;
        }

        return this,this.authClient.send('authenticate', {
            Authentication: jwt,
        }).pipe(
            tap((res)=>{
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => true)
        )
    }
}