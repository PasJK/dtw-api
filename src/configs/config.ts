import { env } from "process";
import * as dotenv from "dotenv";
import { AuthTokenEntity } from "@auth/entities/authToken.entity";
import { CommentEntity } from "@comment/entities/comment.entity";
import { ConfigurationEntity } from "@configurations/entities/configuration.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { PostEntity } from "@post/entities/post.entity";
import { UserEntity } from "@user/entities/user.entity";
import { CommunityTypeEntity } from "../post/entities/communityType.entity";

dotenv.config();

interface InstantInterface {
    MODE: string;
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_SCHEMA: string;
    DB_CONNECTION_NAME: string;
    SALT_ROUND: number;
    JWT_EXP: string;
    WEB_URL: string;
    VERSION: string;
}

export default class Config {
    static getInstantConfig(): InstantInterface {
        return {
            MODE: env.MODE || "DEV",
            PORT: parseInt(env.PORT) || 1780,
            DB_HOST: env.DB_HOST || "localhost",
            DB_PORT: parseInt(env.DB_PORT) || 5432,
            DB_USER: env.DB_USER || "root",
            DB_PASSWORD: env.DB_PASSWORD || "",
            DB_NAME: env.DB_NAME || "",
            DB_SCHEMA: env.DB_SCHEMA || "public",
            DB_CONNECTION_NAME: env.DB_CONNECTION_NAME || "",
            SALT_ROUND: env.SALT_ROUND ? Number(env.SALT_ROUND) || 10 : 10,
            JWT_EXP: env.JWT_EXP || "6h",
            WEB_URL: env.WEB_URL || "http://localhost:3000/",
            VERSION: env.VERSION,
        };
    }

    static getORMConfig(): TypeOrmModuleOptions {
        return {
            name: env.DB_CONNECTION_NAME || "",
            type: "postgres",
            host: env.DB_HOST || "localhost",
            port: parseInt(env.DB_PORT) || 5432,
            username: env.DB_USER || "root",
            password: env.DB_PASSWORD || "",
            database: env.DB_NAME,
            schema: env.DB_SCHEMA || "public",
            entities: [
                UserEntity,
                AuthTokenEntity,
                ConfigurationEntity,
                PostEntity,
                CommentEntity,
                CommunityTypeEntity,
            ],
            synchronize: false,
            logging: true,
        };
    }

    static getJWTSecretKey() {
        return env.JWT_SECRET;
    }

    static getJWTConfig() {
        return {
            secret: this.getJWTSecretKey(),
            signOptions: { expiresIn: this.getInstantConfig().JWT_EXP },
        };
    }
}
