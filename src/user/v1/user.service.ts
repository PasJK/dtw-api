import { DeepPartial, Repository } from "typeorm";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@user/entities/user.entity";

interface FindUserOptions {
    withPassword: boolean;
}

@Injectable()
export class UserServiceV1 {
    constructor(
        @InjectRepository(UserEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private userRepository: Repository<UserEntity>,
    ) {}

    async findOneByEmail(email: string, options?: FindUserOptions): Promise<UserEntity> {
        const query = this.userRepository
            .createQueryBuilder("user")
            .select("user.id")
            .addSelect("user.email")
            .addSelect("user.password")
            .addSelect("user.firstNameTH")
            .addSelect("user.lastNameTH")
            .addSelect("user.fullNameTH")
            .addSelect("user.firstNameEN")
            .addSelect("user.lastNameEN")
            .addSelect("user.fullNameEN")
            .addSelect("user.phone")
            .addSelect("user.lastLogin")
            .addSelect("user.status")
            .where("LOWER(user.email) = :email", { email: email.toLowerCase() })
            .andWhere("user.is_active = true")
            .andWhere("user.is_deleted = false");

        if (options.withPassword) {
            query.addSelect("user.password");
        }

        return query.getOne();
    }

    async update(id: string, updateObj: DeepPartial<UserEntity>) {
        const instance = await this.userRepository.preload({ id, ...updateObj });

        const result = await this.userRepository.save(instance);
        return result;
    }
}
