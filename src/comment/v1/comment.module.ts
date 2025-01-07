import { CommentEntity } from "@comment/entities/comment.entity";
import Config from "@configs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentServiceV1 } from "./comment.service";

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity], Config.getInstantConfig().DB_CONNECTION_NAME)],
    controllers: [],
    providers: [CommentServiceV1],
    exports: [CommentServiceV1],
})
export class CommentModuleV1 {}
