import Config from "src/configs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "@post/entities/post.entity";
import { PostController } from "./post.controller";
import { PostServiceV1 } from "./post.service";

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity], Config.getInstantConfig().DB_CONNECTION_NAME)],
    controllers: [PostController],
    providers: [PostServiceV1],
    exports: [PostServiceV1],
})
export class PostModuleV1 {}
