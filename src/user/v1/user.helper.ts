import { Repository } from "typeorm";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@user/entities/user.entity";

@Injectable()
export class UserHelperV1 {
    constructor(
        @InjectRepository(UserEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private userRepository: Repository<UserEntity>,
    ) {}
}
