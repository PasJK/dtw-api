import { Repository } from "typeorm";
import { FindOptionsWhere } from "typeorm";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorObject } from "@utils/http-services/errorObject";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";
import { AuthTokenEntity } from "./entities/authToken.entity";

@Injectable()
export class AuthTokenService {
    constructor(
        @InjectRepository(AuthTokenEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private readonly authTokenRepository: Repository<AuthTokenEntity>,
    ) {}

    async findActiveToken(criteria: FindOptionsWhere<AuthTokenEntity>): Promise<AuthTokenEntity | null> {
        return this.authTokenRepository.findOne({
            where: criteria,
        });
    }

    async createAuthToken(values: Partial<AuthTokenEntity>): Promise<AuthTokenEntity> {
        return this.authTokenRepository.save(values);
    }

    async deleteAuthToken(id: string): Promise<void> {
        await this.authTokenRepository.delete(id);
    }

    async logout(userId: string): Promise<void> {
        const activeToken = await this.findActiveToken({ userId });

        if (!activeToken) {
            throw new ErrorObject({
                ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                message: "Something went wrong.",
            });
        }

        await this.authTokenRepository.delete(activeToken.id);
    }
}
