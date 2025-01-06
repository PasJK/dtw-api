import { DeepPartial, Repository } from "typeorm";
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

    async create(creatorId: string, postId: string, message: string) {
        const now = new Date();

        const dataCreate: DeepPartial<CommentEntity> = {
            message,
            postId,
            create: {
                createdBy: creatorId,
                createdAt: now,
            },
            update: {
                updatedBy: creatorId,
                updatedAt: now,
            },
        };

        const comment = this.commentRepository.create(dataCreate);
        await this.commentRepository.save(comment);
    }

    async findAllCommentByPostId(postId: string) {
        return this.commentRepository.find({ where: { postId } });
    }
}
