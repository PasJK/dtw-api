import { Injectable } from "@nestjs/common";
import { UserServiceV1 } from "@user/v1/user.service";
import { ErrorObject } from "@utils/http-services/errorObject";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";
import { LoginResponse } from "@utils/interface/auth.interface";
import { UserAgent } from "@utils/interface/userAgent.interface";
import { AuthHelper } from "./auth.helper";
import { LoginDto } from "./dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserServiceV1,
        private readonly authHelper: AuthHelper,
    ) {}

    async login(loginDto: LoginDto, userAgent: UserAgent): Promise<LoginResponse> {
        const { username } = loginDto;
        const userObj = await this.userService.findOneByUsername(username);

        if (!userObj) {
            throw new ErrorObject({
                ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                message: "User not found.",
            });
        }

        const accessToken = await this.authHelper.generateAccessToken(userObj, userAgent);

        return accessToken;
    }
}
