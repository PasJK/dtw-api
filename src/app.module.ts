import { AuthModule } from "@auth/auth.module";
import Config from "@configs/config";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModuleV1 } from "@user/v1/user.module";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            ...Config.getJWTConfig(),
        }),
        AuthModule,
        UserModuleV1,
        TypeOrmModule.forRoot(Config.getORMConfig()),
    ],
})
export class AppModule {}
