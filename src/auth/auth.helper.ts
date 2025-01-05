import { AuthTokenService } from "@auth/authToken.service";
import { ConfigurationService } from "@configurations/configuration.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "@user/entities/user.entity";
import { UserServiceV1 } from "@user/v1/user.service";
import { ErrorObject } from "@utils/http-services/errorObject";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";
import { AccessTokenPayload } from "@utils/interface/jwtToken";
import { UserAgent } from "@utils/interface/userAgent.interface";
import { prepareUserAgent } from "@utils/userAgent";
import { AuthTokenEntity } from "./entities/authToken.entity";
import { JwtStrategy } from "./jwt/jwt.strategy";

@Injectable()
export class AuthHelper {
    constructor(
        private readonly authTokenService: AuthTokenService,
        private readonly configurationService: ConfigurationService,
        @Inject(forwardRef(() => UserServiceV1))
        private readonly userService: UserServiceV1,
        @Inject(forwardRef(() => JwtStrategy))
        private readonly jwtStrategy: JwtStrategy,
        @Inject(forwardRef(() => JwtService))
        private readonly jwtService: JwtService,
    ) {}

    async validateToken(token: string): Promise<AccessTokenPayload> {
        const payload = await this.jwtService.verifyAsync(token);
        if (!payload) {
            throw new ErrorObject(SERVICE_STATUS.UNAUTHORIZED);
        }
        return payload;
    }

    private async createAuthToken(userId: string, accessToken: string, userAgent: string): Promise<AuthTokenEntity> {
        const values: Partial<AuthTokenEntity> = {
            userAgent,
            userId,
            accessToken,
            accessTokenExpiredAt: await this.jwtStrategy.getExpirationDate(accessToken),
            create: {
                createdAt: new Date(),
                createdBy: userId,
            },
            update: {
                updatedAt: new Date(),
                updatedBy: userId,
            },
        };

        return this.authTokenService.createAuthToken(values);
    }

    async generateAccessToken(user: UserEntity, userAgent: UserAgent): Promise<string> {
        const nowDate = new Date();
        const configs = await this.configurationService.getConfigs();
        const accessToken = await this.jwtStrategy.generateAccessToken(user, configs);
        const userAgentString = await prepareUserAgent(userAgent);
        const activeToken = await this.authTokenService.findActiveToken({ userId: user.id });

        if (activeToken) {
            await this.authTokenService.deleteAuthToken(activeToken.id);
        }

        await this.userService.update(user.id, { lastLogin: nowDate });
        await this.createAuthToken(user.id, accessToken, userAgentString);

        return accessToken;
    }
}
