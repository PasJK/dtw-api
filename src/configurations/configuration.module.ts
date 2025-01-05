import Config from "src/configs/config";
import { ConfigurationEntity } from "@configurations/entities/configuration.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigurationService } from "./configuration.service";

@Module({
    imports: [TypeOrmModule.forFeature([ConfigurationEntity], Config.getInstantConfig().DB_CONNECTION_NAME)],
    controllers: [],
    providers: [ConfigurationService],
    exports: [ConfigurationService],
})
export class ConfigurationModule {}
