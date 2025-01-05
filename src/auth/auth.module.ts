import Config from "src/configs/config";
import { UserModuleV1 } from "src/user/v1/user.module";
import { AuthTokenEntity } from "@auth/entities/authToken.entity";
import { JwtStrategy } from "@auth/jwt/jwt.strategy";
import { ConfigurationModule } from "@configurations/configuration.module";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthHelper } from "./auth.helper";
import { AuthService } from "./auth.service";
import { AuthTokenService } from "./authToken.service";
@Module({
    imports: [
        TypeOrmModule.forFeature([AuthTokenEntity], Config.getInstantConfig().DB_CONNECTION_NAME),
        PassportModule,
        ConfigurationModule,
        UserModuleV1,
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthTokenService, AuthHelper, JwtStrategy],
    exports: [AuthService, AuthTokenService, AuthHelper, JwtStrategy],
})
export class AuthModule {}
