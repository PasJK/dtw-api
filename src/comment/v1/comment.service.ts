import { DeepPartial, Repository } from "typeorm";
import { CommentEntity } from "@comment/entities/comment.entity";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindAllCommentDto } from "@post/v1/dto/findAllComment.dto";
import { getPagination, getPaginationOffset } from "@utils/pagination";

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

    async findAllCommentByPostId(postId: string, query?: FindAllCommentDto) {
        const { perPage = 10, page = 1 } = query || {};
        const perPageNumber = Number(perPage);
        const pageNumber = Number(page);
        const perPageOffset = await getPaginationOffset(pageNumber, perPageNumber);

        const queryBuilder = this.commentRepository
            .createQueryBuilder("comment")
            .select([
                'comment.id AS "id"',
                'comment.message AS "message"',
                'comment.createdAt AS "createdAt"',
                'users.username AS "author"',
            ])
            .leftJoin("users", "users", "users.id = comment.createdBy")
            .where("comment.postId = :postId", { postId })
            .orderBy("comment.create.createdAt", "DESC");

        if (query) {
            queryBuilder.offset(perPageOffset).limit(perPageNumber);
        }

        const commentList = await queryBuilder.getRawMany<CommentEntity>();
        const total = await this.getCountComments(postId);

        return {
            data: commentList,
            meta: await getPagination(pageNumber, perPageNumber, commentList.length, total),
        };
    }

    async getCountComments(postId: string) {
        const queryBuilder = this.commentRepository.createQueryBuilder("comment");

        return queryBuilder.where("comment.postId = :postId", { postId }).getCount();
    }
}
