import Config from "src/configs/config";
import { CommentEntity } from "@comment/entities/comment.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentController } from "./comment.controller";
import { CommentServiceV1 } from "./comment.service";

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity], Config.getInstantConfig().DB_CONNECTION_NAME)],
    controllers: [CommentController],
    providers: [CommentServiceV1],
    exports: [CommentServiceV1],
})
export class CommentModuleV1 {}
