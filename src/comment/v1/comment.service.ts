import { Repository } from "typeorm";
import { CommentEntity } from "@comment/entities/comment.entity";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CommentServiceV1 {
    constructor(
        @InjectRepository(CommentEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private commentRepository: Repository<CommentEntity>,
    ) {}
}
