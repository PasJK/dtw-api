import { DeepPartial, Repository } from "typeorm";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@user/entities/user.entity";

@Injectable()
export class UserServiceV1 {
    constructor(
        @InjectRepository(UserEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private userRepository: Repository<UserEntity>,
    ) {}

    async findOneByUsername(username: string): Promise<UserEntity> {
        const query = this.userRepository
            .createQueryBuilder("user")
            .select("user.id")
            .addSelect("user.username")
            .addSelect("user.lastLogin")
            .addSelect("user.status")
            .addSelect("user.isActive")
            .addSelect("user.isDeleted")
            .where("LOWER(user.username) = :username", { username: username.toLowerCase() })
            .andWhere("user.is_active = true")
            .andWhere("user.is_deleted = false")
            .leftJoinAndSelect("user.authTokens", "authTokens");

        return query.getOne();
    }

    async update(id: string, updateObj: DeepPartial<UserEntity>) {
        const instance = await this.userRepository.preload({ id, ...updateObj });

        const result = await this.userRepository.save(instance);
        return result;
    }
}
