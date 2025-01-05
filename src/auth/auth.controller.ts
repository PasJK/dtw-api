import { Response } from "express";
import { AuthTokenService } from "@auth/authToken.service";
import { Body, Controller, Post, Request, Res } from "@nestjs/common";
import { Public } from "@utils/decorator";
import { HttpResponse } from "@utils/http-services/httpResponse";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";
import { RequestWithAuth } from "@utils/interface";
import { UserAgent } from "@utils/interface/userAgent.interface";
import { AuthService } from "./auth.service";
import { UserAgentInfo } from "./decorator/userAgent.decorator";
import { LoginDto } from "./dto";
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authTokenService: AuthTokenService,
    ) {}

    @Public()
    @Post("login")
    async login(
        @Body() loginDto: LoginDto,
        @UserAgentInfo() userAgent: UserAgent,
        @Res({ passthrough: true }) response: Response,
    ): Promise<HttpResponse> {
        const token = await this.authService.login(loginDto, userAgent);
        response.cookie("token", token);

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
            data: token,
        });
    }

    @Post("logout")
    async logout(
        @Request() req: RequestWithAuth,
        @Res({ passthrough: true }) response: Response,
    ): Promise<HttpResponse> {
        const { id: userId } = req.user;

        await this.authTokenService.logout(userId);

        response.cookie("token", "", {
            expires: new Date(0),
        });

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
        });
    }
}
