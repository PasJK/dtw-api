import { Repository } from "typeorm";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigurationEntity } from "./entities/configuration.entity";

@Injectable()
export class ConfigurationService {
    constructor(
        @InjectRepository(ConfigurationEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private readonly configurationRepository: Repository<ConfigurationEntity>,
    ) {}

    async getConfigs(): Promise<ConfigurationEntity> {
        return this.configurationRepository.findOneBy({});
    }
}
