import { Injectable } from "@nestjs/common";
import { UserServiceV1 } from "@user/v1/user.service";
import { Hash } from "@utils/hash";
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
        const { email, password } = loginDto;
        const userObj = await this.userService.findOneByEmail(email, { withPassword: true });

        if (!userObj) {
            throw new ErrorObject({
                ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                message: "User not found.",
            });
        }

        const isCorrectPassword = userObj.password ? Hash.compareHash(password.toString(), userObj.password) : false;
        if (!isCorrectPassword) {
            throw new ErrorObject({
                ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                message: "Incorrect email or password.",
            });
        }

        const accessToken = await this.authHelper.generateAccessToken(userObj, userAgent);

        return accessToken;
    }
}
