import { CommentModuleV1 } from "@comment/v1/comment.module";
import Config from "@configs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommunityTypeEntity } from "@post/entities/communityType.entity";
import { PostEntity } from "@post/entities/post.entity";
import { PostController } from "./post.controller";
import { PostHelperServiceV1 } from "./post.helper";
import { PostServiceV1 } from "./post.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity, CommunityTypeEntity], Config.getInstantConfig().DB_CONNECTION_NAME),
        CommentModuleV1,
    ],
    controllers: [PostController],
    providers: [PostServiceV1, PostHelperServiceV1],
    exports: [PostServiceV1, PostHelperServiceV1],
})
export class PostModuleV1 {}
