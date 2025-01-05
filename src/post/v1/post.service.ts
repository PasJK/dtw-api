import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommunityTypeEntity } from "@post/entities/communityType.entity";
import { PostEntity } from "@post/entities/post.entity";
import { ErrorObject } from "@utils/http-services/errorObject";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";
import { RequestUser } from "@utils/interface/requestWithAuth.interface";
import { getPagination } from "@utils/pagination";
import { FindAllPostDto } from "./dto/findAllPost.dto";
import { StorePostDto } from "./dto/storePost.dto";

@Injectable()
export class PostServiceV1 {
    constructor(
        @InjectRepository(PostEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private postRepository: Repository<PostEntity>,

        @InjectRepository(CommunityTypeEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private communityTypeRepository: Repository<CommunityTypeEntity>,
    ) {}

    async getAllPosts(requester: RequestUser, query: FindAllPostDto) {
        const { perPage = 10, page = 1, search, order = "DESC", orderBy = "createdAt", communityType, ourPost } = query;
        const perPageNumber = Number(perPage);
        const pageNumber = Number(page);

        const queryBuilder = this.postRepository.createQueryBuilder("post");

        if (search) {
            queryBuilder.where("post.title LIKE :search", { search: `%${search}%` });
        }

        if (communityType) {
            queryBuilder.where("post.communityType = :communityType", { communityType });
        }

        if (orderBy) {
            queryBuilder.orderBy(`post.${orderBy}`, order?.toUpperCase() as "ASC" | "DESC");
        }

        if (ourPost) {
            queryBuilder.where("post.create.createdBy = :requesterId", { requesterId: requester.id });
        }

        const [posts, total] = await queryBuilder
            .select([
                "post.id",
                "post.title",
                "post.contents",
                "post.communityType",
                "post.lastActivityAt",
                'post.createdBy as "creatorId"',
                'post.createdAt as "createdAt"',
                'post.updatedBy as "updaterId"',
                'post.updatedAt as "updatedAt"',
            ])
            .where("post.isDeleted = :isDeleted", { isDeleted: false })
            .skip((pageNumber - 1) * perPageNumber)
            .take(perPageNumber)
            .getManyAndCount();

        return {
            data: posts,
            meta: await getPagination(pageNumber, perPageNumber, posts.length, total),
        };
    }

    async findPostTitle(id: string, title: string, type: string): Promise<PostEntity | null> {
        return this.postRepository.findOne({
            where: { create: { createdBy: id }, title, communityType: type, delete: { isDeleted: null } },
        });
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

        return queryBuilder
            .select([
                'post.id AS "id"',
                'post.title AS "title"',
                'post.contents AS "contents"',
                'post.communityType AS "communityType"',
                'post.lastActivityAt AS "lastActivityAt"',
                'post.createdBy AS "createdBy"',
                'post.createdAt AS "createdAt"',
                'post.updatedBy AS "updatedBy"',
                'post.updatedAt AS "updatedAt"',
            ])
            .getRawOne();
    }

    async createPost(requester: RequestUser, body: StorePostDto) {
        const { communityType, title, contents } = body;
        const creatorId = requester.id;
        const now = new Date();

        const titleExist = await this.findPostTitle(creatorId, title, communityType);

        if (titleExist) {
            throw new ErrorObject({
                ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                message: "Title already exists in this community",
            });
        }

        const dataCreate: DeepPartial<PostEntity> = {
            title,
            communityType,
            contents,
            lastActivityAt: now,
            create: {
                createdBy: creatorId,
                createdAt: now,
            },
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
        const { title, contents, communityType } = body;
        const updaterId = requester.id;
        const now = new Date();

        const post = await this.findOnePost({ where: { id } });

        if (!post) {
            throw new ErrorObject({
                ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                message: "Post not found",
            });
        }

        const dataUpdate: DeepPartial<PostEntity> = {
            title,
            contents,
            communityType,
            lastActivityAt: now,
            update: {
                updatedBy: updaterId,
                updatedAt: now,
            },
        };

        const instance = await this.postRepository.preload({ id, ...dataUpdate });
        return this.postRepository.save(instance);
    }

    async softDeletePost(requester: RequestUser, id: string): Promise<void> {
        const post = await this.findOnePost({ where: { id } });

        if (!post) {
            throw new ErrorObject({
                ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                message: "Post not found",
            });
        }

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
        });
    }
}
