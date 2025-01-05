import Config from "src/configs/config";
import { ConfigurationModule } from "@configurations/configuration.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@user/entities/user.entity";
import { UserController } from "./user.controller";
import { UserHelperV1 } from "./user.helper";
import { UserServiceV1 } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity], Config.getInstantConfig().DB_CONNECTION_NAME),
        ConfigurationModule,
    ],
    controllers: [UserController],
    providers: [UserServiceV1, UserHelperV1],
    exports: [UserServiceV1, UserHelperV1, ConfigurationModule],
})
export class UserModuleV1 {}
