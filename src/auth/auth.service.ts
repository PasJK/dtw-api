import { Injectable } from "@nestjs/common";
import { UserServiceV1 } from "@user/v1/user.service";
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
        let userObj = await this.userService.findOneByUsername(username);

        if (!userObj) {
            userObj = await this.userService.signup(username);
        }

        const accessToken = await this.authHelper.generateAccessToken(userObj, userAgent);

        return accessToken;
    }
}
