import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { CommentServiceV1 } from "@comment/v1/comment.service";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityTypeEntity } from "@post/entities/communityType.entity";
import { PostEntity } from "@post/entities/post.entity";
import { ErrorObject } from "@utils/http-services/errorObject";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";
import { ResultWithPagination } from "@utils/interface";
import { RequestUser } from "@utils/interface/requestWithAuth.interface";
import { getPagination, getPaginationOffset } from "@utils/pagination";
import { CreateCommentDto } from "./dto/createComment.dto";
import { FindAllCommentDto } from "./dto/findAllComment.dto";
import { FindAllPostDto } from "./dto/findAllPost.dto";
import { StorePostDto } from "./dto/storePost.dto";
import { PostHelperServiceV1 } from "./postHelper.service";

type PostWithTotalComments = PostEntity & { totalComments: number };

@Injectable()
export class PostServiceV1 {
    constructor(
        @InjectRepository(PostEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private postRepository: Repository<PostEntity>,

        @InjectRepository(CommunityTypeEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private communityTypeRepository: Repository<CommunityTypeEntity>,

        private commentService: CommentServiceV1,
        private postHelperService: PostHelperServiceV1,
    ) {}

    async getAllPosts(
        query: FindAllPostDto,
        requester?: RequestUser,
    ): Promise<ResultWithPagination<PostWithTotalComments>> {
        const {
            perPage = 10,
            page = 1,
            search,
            order = "DESC",
            orderBy = "lastActivityAt",
            community,
            ourPost,
        } = query;
        const perPageNumber = Number(perPage);
        const pageNumber = Number(page);
        const perPageOffset = await getPaginationOffset(pageNumber, perPageNumber);

        const queryBuilder = this.postRepository
            .createQueryBuilder("post")
            .where("post.delete.isDeleted = :isDeleted", { isDeleted: false });

        if (search) {
            queryBuilder.andWhere("post.title ILIKE :search", { search: `%${search.toLowerCase()}%` });
        }

        if (community) {
            queryBuilder.andWhere("post.communityType = :community", { community });
        }

        if (orderBy) {
            queryBuilder.orderBy(`post.${orderBy}`, order?.toUpperCase() as "ASC" | "DESC");
        }

        if (ourPost) {
            queryBuilder.andWhere("post.createdBy = :requesterId", { requesterId: requester.id });
        }

        const posts = await queryBuilder
            .select([
                'post.id AS "id"',
                'post.title AS "title"',
                'post.contents AS "contents"',
                'post.communityType AS "community"',
                'users.username AS "author"',
            ])

            .leftJoin("users", "users", "users.id = post.createdBy")
            .offset(perPageOffset)
            .limit(perPageNumber)
            .getRawMany<PostWithTotalComments>();

        for (const post of posts) {
            const commentList = await this.commentService.findAllCommentByPostId(post.id);
            post.totalComments = commentList.data.length;
        }

        const total = await this.getCountPosts(requester, query);

        return {
            data: posts,
            meta: await getPagination(pageNumber, perPageNumber, posts.length, total),
        };
    }

    async getCountPosts(requester: RequestUser, query: FindAllPostDto) {
        const { search, community, ourPost } = query;

        const queryBuilder = this.postRepository
            .createQueryBuilder("post")
            .where("post.delete.isDeleted = :isDeleted", { isDeleted: false });

        if (search) {
            queryBuilder.andWhere("post.title LIKE :search", { search: `%${search}%` });
        }

        if (community) {
            queryBuilder.andWhere("post.communityType = :community", { community });
        }

        if (ourPost) {
            queryBuilder.andWhere("post.createdBy = :requesterId", { requesterId: requester.id });
        }

        return queryBuilder.getCount();
    }

    async findPostTitle(id: string, title: string, type: string): Promise<PostEntity | null> {
        return this.postRepository
            .createQueryBuilder("post")
            .where("post.createdBy = :createdBy", { createdBy: id })
            .andWhere("post.title ILIKE :title", { title: `%${title}%` })
            .andWhere("post.communityType = :type", { type })
            .andWhere("post.delete.isDeleted = :isDeleted", { isDeleted: false })
            .getOne();
    }

    async findOnePost(options: FindOneOptions): Promise<PostEntity | null> {
        const queryBuilder = this.postRepository
            .createQueryBuilder("post")
            .where("post.isDeleted = :isDeleted", { isDeleted: false });

        if (options.where) {
            Object.entries(options.where).forEach(([key, value]) => {
                console.log(key, value);

                queryBuilder.andWhere(`post.${key} = :${key}`, { [key]: value });
            });
        }

        const post = await queryBuilder
            .select([
                'post.id AS "id"',
                'post.title AS "title"',
                'post.contents AS "contents"',
                'post.communityType AS "community"',
                'post.createdAt AS "createdAt"',
                'post.lastActivityAt AS "lastActivityAt"',
                'users.username AS "author"',
            ])
            .leftJoin("users", "users", "users.id = post.createdBy")
            .getRawOne<PostWithTotalComments>();

        const commentList = await this.commentService.findAllCommentByPostId(post.id);
        post.totalComments = commentList.data.length;

        return post;
    }

    async findAllCommentByPostId(id: string, query?: FindAllCommentDto) {
        return this.commentService.findAllCommentByPostId(id, query);
    }

    async createPost(requester: RequestUser, body: StorePostDto) {
        const { community, title, contents } = body;
        const creatorId = requester.id;
        const now = new Date();

        const titleExist = await this.findPostTitle(creatorId, title, community);

        if (titleExist) {
            throw new ErrorObject({
                ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                message: "Title already exists in this community",
            });
        }

        const dataCreate: DeepPartial<PostEntity> = {
            title,
            communityType: community,
            contents,
            lastActivityAt: now,
            createdAt: now,
            createdBy: creatorId,
            update: {
                updatedBy: creatorId,
                updatedAt: now,
            },
        };

        const post = this.postRepository.create(dataCreate);
        const savedPost = await this.postRepository.save(post);

        return this.findOnePost({ where: { id: savedPost.id } });
    }

    async updatePost(requester: RequestUser, id: string, body: StorePostDto) {
        const { title, contents, community } = body;
        const updaterId = requester.id;
        const now = new Date();

        await this.postHelperService.verifyPost(id);

        const dataUpdate: DeepPartial<PostEntity> = {
            title,
            contents,
            communityType: community,
            lastActivityAt: now,
            update: {
                updatedBy: updaterId,
                updatedAt: now,
            },
        };

        const instance = await this.postRepository.preload({ id, ...dataUpdate });
        return this.postRepository.save(instance);
    }

    async updateLastActivityAt(id: string, lastActivityAt: Date) {
        const instance = await this.postRepository.preload({ id, lastActivityAt });
        return this.postRepository.save(instance);
    }

    async softDeletePost(requester: RequestUser, id: string): Promise<void> {
        await this.postHelperService.verifyPost(id);

        const softDeleteData = {
            status: "deleted",
            delete: {
                isDeleted: true,
                deletedBy: requester.id,
                deletedAt: new Date(),
            },
        };

        const instance = await this.postRepository.preload({ id, ...softDeleteData });
        await this.postRepository.save(instance);
    }

    async getCommunityDropdown() {
        return this.communityTypeRepository.find({
            select: ["name", "key"],
            order: {
                priority: "ASC",
            },
        });
    }

    async createComment(requester: RequestUser, postId: string, body: CreateCommentDto): Promise<void> {
        const { message } = body;
        const creatorId = requester.id;

        await this.postHelperService.verifyPost(postId);
        await this.commentService.create(creatorId, postId, message);
        await this.updateLastActivityAt(postId, new Date());
    }
}
