import { ExtractJwt, Strategy } from "passport-jwt";
import Config from "src/configs/config";
import { ConfigurationEntity } from "@configurations/entities/configuration.entity";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { UserEntity } from "@user/entities/user.entity";
import { UserServiceV1 } from "@user/v1/user.service";
import { extractToken } from "@utils/cookies";
import { TokenType } from "@utils/enum/token.enum";
import { AccessTokenPayload, DecodedToken } from "@utils/interface/jwtToken";
import { RequestWithAuth } from "@utils/interface/requestWithAuth.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserServiceV1,
        private readonly jwtService: JwtService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: Config.getJWTSecretKey(),
        });
    }

    private static extractJWT(req: RequestWithAuth): string | null {
        return extractToken(req);
    }

    async validate() {}

    async generateAccessToken(user: UserEntity, configs: ConfigurationEntity): Promise<string> {
        const nowDate = new Date();
        const payload: AccessTokenPayload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            lastLogin: nowDate,
            inActivityLimit: configs.clientInactivityTime || 30 * 60 * 1000,
            tokenType: TokenType.ACCESS,
        };

        const options = {
            expiresIn: configs?.accessTokenExpiredTime || "1h",
        };

        return this.jwtService.signAsync(payload, options);
    }

    async getExpirationDate(token: string): Promise<Date> {
        const decodedToken: DecodedToken = this.jwtService.decode(token);

        if (!decodedToken || !decodedToken.exp) {
            return null;
        }

        const expirationTime = decodedToken.exp * 1000;
        return new Date(expirationTime);
    }
}
