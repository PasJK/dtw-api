import { Test, TestingModule } from "@nestjs/testing";
import { PostEntity } from "@post/entities/post.entity";
import { PostServiceV1 } from "@post/v1/post.service";
import Config from "@configs/config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FindAllCommentDto } from "@post/v1/dto/findAllComment.dto";
import { createMockRepository } from "@testUtils/mockQueryBuilder";
import { CommentServiceV1 } from "@comment/v1/comment.service";
import { CommunityTypeEntity } from "@post/entities/communityType.entity";
import { FindAllPostDto } from "@post/v1/dto/findAllPost.dto";
import { RequestUser } from "@utils/interface/requestWithAuth.interface";
import { CommentModuleV1 } from "@comment/v1/comment.module";
import { PostHelperServiceV1 } from "@post/v1/postHelper.service";
import { CommentEntity } from "@comment/entities/comment.entity";
import { createMockService } from "@testUtils/createMockService";
import { StorePostDto } from "@post/v1/dto/storePost.dto";
import { ErrorObject } from "@utils/http-services/errorObject";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";
import { DeepPartial } from "typeorm";
import { CreateCommentDto } from "@post/v1/dto/createComment.dto";

describe("PostServiceV1", () => {
    const mockPostRepository = createMockRepository<PostEntity>();
    const mockCommunityTypeRepository = createMockRepository<CommunityTypeEntity>();
    const mockCommentService = createMockService<CommentServiceV1>(CommentServiceV1);
    let postService: PostServiceV1;
    let postHelperService: PostHelperServiceV1;
    let mockDate = new Date();
    const mockResultPostEntity = [
        {
            id: "1",
            title: "Test Post",
            content: "This is a test post",
            createdAt: mockDate,
        },
    ];
    const mockResultCommentEntity = {
        data: [
            {
                id: "1",
                message: "This is a test comment",
                author: "John Doe",
                postId: "1",
                create: {
                    createdBy: "123",
                    createdAt: mockDate,
                },
                update: {
                    updatedBy: "123",
                    updatedAt: mockDate,
                },
                delete: {
                    isDeleted: false,
                    deletedBy: null,
                    deletedAt: null,
                },
                post: null,
            },
        ],
        meta: {
            total: 1,
            page: 1,
            perPage: 10,
            totalRecord: 1,
            totalPage: 1,
        },
    };

    const requester = {
        id: "123",
        username: "John Doe",
    } as RequestUser;

    beforeEach(async () => {
        mockDate = new Date("2025-08-07 00:00:00");
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                PostServiceV1,
                PostHelperServiceV1,
                {
                    provide: getRepositoryToken(PostEntity, Config.getInstantConfig().DB_CONNECTION_NAME),
                    useValue: mockPostRepository,
                },
                {
                    provide: getRepositoryToken(CommunityTypeEntity, Config.getInstantConfig().DB_CONNECTION_NAME),
                    useValue: mockCommunityTypeRepository,
                },
                {
                    provide: CommentServiceV1,
                    useValue: mockCommentService,
                },
            ],
        }).compile();

        postService = module.get<PostServiceV1>(PostServiceV1);
        postHelperService = module.get<PostHelperServiceV1>(PostHelperServiceV1);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(postService).toBeDefined();
    });

    describe("Create Post", () => {
        it("should create post case title already exists", async () => {
            const body = {
                community: "community",
                title: "test",
                contents: "test",
            } as StorePostDto;
            const mockPostEntity = {
                id: "1",
                title: "test",
                contents: "test",
                createdAt: mockDate,
            } as PostEntity;

            jest.spyOn(postService, "findPostTitle").mockResolvedValueOnce(mockPostEntity);
            await expect(postService.createPost(requester, body)).rejects.toThrow(
                new ErrorObject({
                    ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                    message: "Title already exists in this community",
                }),
            );
        });

        it("should create post case title not exists", async () => {
            const body = {
                community: "community",
                title: "test",
                contents: "test",
            } as StorePostDto;
            const mockPostEntity = {
                id: "1",
                title: "test",
                contents: "test",
                communityType: "community",
                lastActivityAt: mockDate,
                createdAt: mockDate,
                createdBy: requester.id,
                update: {
                    updatedBy: requester.id,
                    updatedAt: mockDate,
                },
            } as PostEntity;

            const dataCreate: DeepPartial<PostEntity> = {
                title: body.title,
                communityType: body.community,
                contents: body.contents,
                lastActivityAt: mockDate,
                createdAt: mockDate,
                createdBy: requester.id,
                update: {
                    updatedBy: requester.id,
                    updatedAt: mockDate,
                },
            };

            jest.spyOn(postService, "findPostTitle").mockResolvedValueOnce(null);
            jest.spyOn(postService, "findOnePost").mockResolvedValueOnce(mockPostEntity);
            jest.spyOn(mockPostRepository, "create").mockResolvedValueOnce(mockPostEntity as never);
            jest.spyOn(mockPostRepository, "save").mockResolvedValueOnce(mockPostEntity);
            await postService.createPost(requester, body);

            expect(mockPostRepository.create).toHaveBeenCalledWith(dataCreate);
            expect(mockPostRepository.save).toHaveBeenCalled();
        });

        it("should create comment case post not found", async () => {
            const id = "1";
            const body = {
                message: "test",
            } as CreateCommentDto;

            jest.spyOn(postHelperService, "verifyPost").mockRejectedValueOnce(
                new ErrorObject({
                    ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                    message: "Post not found",
                }),
            );
            jest.spyOn(postService, "updateLastActivityAt").mockResolvedValueOnce(null);

            await expect(postService.createComment(requester, id, body)).rejects.toThrow(
                new ErrorObject({
                    ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                    message: "Post not found",
                }),
            );
            expect(postHelperService.verifyPost).toHaveBeenCalledWith(id);
            expect(mockCommentService.create).not.toHaveBeenCalled();
            expect(postService.updateLastActivityAt).not.toHaveBeenCalled();
        });

        it("should create comment should be success", async () => {
            const id = "1";
            const body = {
                message: "test",
            } as CreateCommentDto;

            jest.spyOn(postHelperService, "verifyPost").mockResolvedValueOnce(null);
            jest.spyOn(postService, "updateLastActivityAt").mockResolvedValueOnce(null);
            await postService.createComment(requester, id, body);

            expect(postHelperService.verifyPost).toHaveBeenCalledWith(id);
            expect(mockCommentService.create).toHaveBeenCalledWith(requester.id, id, body.message);
            expect(postService.updateLastActivityAt).toHaveBeenCalledWith(id, mockDate);
        });
    });

    describe("Update Post", () => {
        it("should update post case post not found", async () => {
            const id = "1";
            const body = {
                community: "community",
                title: "test",
                contents: "test",
            } as StorePostDto;
            const mockPostEntity = {
                id: "1",
                title: "test",
                contents: "test",
                createdAt: mockDate,
            } as PostEntity;

            jest.spyOn(postService, "findOnePost").mockResolvedValueOnce(mockPostEntity);
            await expect(postService.updatePost(requester, id, body)).rejects.toThrow(
                new ErrorObject({
                    ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                    message: "Post not found",
                }),
            );
        });

        it("should update post case title not exists", async () => {
            const id = "1";
            const body = {
                community: "community",
                title: "test",
                contents: "test",
            } as StorePostDto;

            const preparePreload = {
                id,
                title: body.title,
                contents: body.contents,
                communityType: body.community,
                lastActivityAt: mockDate,
                update: {
                    updatedBy: requester.id,
                    updatedAt: mockDate,
                },
            };

            const mockPostEntity = {
                id: "1",
                title: "test",
                contents: "test",
                createdAt: mockDate,
            } as PostEntity;

            jest.spyOn(postHelperService, "verifyPost").mockResolvedValueOnce();
            jest.spyOn(mockPostRepository, "preload").mockResolvedValueOnce(mockPostEntity);
            await postService.updatePost(requester, id, body);

            expect(postHelperService.verifyPost).toHaveBeenCalledWith(id);
            expect(mockPostRepository.preload).toHaveBeenCalledWith(preparePreload);
            expect(mockPostRepository.save).toHaveBeenCalled();
        });

        it("update last activity at should be success", async () => {
            const id = "1";
            const lastActivityAt = mockDate;
            const mockPostEntity = {
                id: "1",
                lastActivityAt: mockDate,
            } as PostEntity;

            jest.spyOn(mockPostRepository, "preload").mockResolvedValueOnce(mockPostEntity);
            await postService.updateLastActivityAt(id, lastActivityAt);

            expect(mockPostRepository.preload).toHaveBeenCalledWith({ id, lastActivityAt });
            expect(mockPostRepository.save).toHaveBeenCalled();
        });
    });

    describe("Delete Post", () => {
        it("should delete post case post not found", async () => {
            const id = "1";

            jest.spyOn(postHelperService, "verifyPost").mockRejectedValueOnce(
                new ErrorObject({
                    ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                    message: "Post not found",
                }),
            );
            await expect(postService.softDeletePost(requester, id)).rejects.toThrow(
                new ErrorObject({
                    ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                    message: "Post not found",
                }),
            );
        });

        it("should delete post should be success", async () => {
            const id = "1";

            const mockPostEntity = {
                id: "1",
                status: "deleted",
                delete: {
                    isDeleted: true,
                    deletedBy: requester.id,
                    deletedAt: mockDate,
                },
            } as PostEntity;

            const softDeleteData = {
                status: "deleted",
                delete: {
                    isDeleted: true,
                    deletedBy: requester.id,
                    deletedAt: mockDate,
                },
            };

            jest.spyOn(postHelperService, "verifyPost").mockResolvedValueOnce();
            jest.spyOn(mockPostRepository, "preload").mockResolvedValueOnce(mockPostEntity);
            jest.spyOn(mockPostRepository, "save").mockResolvedValueOnce(mockPostEntity);
            await postService.softDeletePost(requester, id);

            expect(postHelperService.verifyPost).toHaveBeenCalledWith(id);
            expect(mockPostRepository.preload).toHaveBeenCalledWith({ id, ...softDeleteData });
            expect(mockPostRepository.save).toHaveBeenCalled();
        });
    });

    describe("Select Post", () => {
        it("should get community dropdown should be success", async () => {
            const mockCommunityTypeEntity = {
                name: "community",
                key: "community",
            } as CommunityTypeEntity;

            jest.spyOn(mockCommunityTypeRepository, "find").mockResolvedValueOnce([mockCommunityTypeEntity]);

            await postService.getCommunityDropdown();

            expect(mockCommunityTypeRepository.find).toHaveBeenCalled();
            expect(mockCommunityTypeRepository.find).toHaveBeenCalledWith({
                select: ["name", "key"],
                order: {
                    priority: "ASC",
                },
            });
        });

        it("should get all posts", async () => {
            const query = {
                perPage: "10",
                page: "1",
                search: "test",
                order: "DESC",
                orderBy: "lastActivityAt",
                community: "community",
            } as FindAllPostDto;

            jest.spyOn(mockPostRepository.createQueryBuilder(), "getRawMany").mockResolvedValueOnce(
                mockResultPostEntity,
            );
            jest.spyOn(mockCommentService, "findAllCommentByPostId").mockResolvedValueOnce(mockResultCommentEntity);
            await postService.getAllPosts(query, requester);

            expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith("post");
            expect(mockPostRepository.createQueryBuilder().select).toHaveBeenCalledWith([
                'post.id AS "id"',
                'post.title AS "title"',
                'post.contents AS "contents"',
                'post.communityType AS "community"',
                'users.username AS "author"',
            ]);
            expect(mockCommentService.findAllCommentByPostId).toHaveBeenCalledWith("1");
            expect(mockPostRepository.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
                "users",
                "users",
                "users.id = post.createdBy",
            );
        });

        it("should get all our posts", async () => {
            const query = {
                perPage: "10",
                page: "1",
                search: "test",
                order: "DESC",
                orderBy: "lastActivityAt",
                community: "community",
                ourPost: true,
            } as FindAllPostDto;

            jest.spyOn(mockPostRepository.createQueryBuilder(), "getRawMany").mockResolvedValueOnce(
                mockResultPostEntity,
            );
            jest.spyOn(mockCommentService, "findAllCommentByPostId").mockResolvedValueOnce(mockResultCommentEntity);
            await postService.getAllPosts(query, requester);

            expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith("post");
            expect(mockPostRepository.createQueryBuilder().select).toHaveBeenCalledWith([
                'post.id AS "id"',
                'post.title AS "title"',
                'post.contents AS "contents"',
                'post.communityType AS "community"',
                'users.username AS "author"',
            ]);
            expect(mockCommentService.findAllCommentByPostId).toHaveBeenCalledWith("1");
            expect(mockPostRepository.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
                "users",
                "users",
                "users.id = post.createdBy",
            );
        });

        it("find post title should be success", async () => {
            const id = "1";
            const search = "test";
            const community = "community";

            await postService.findPostTitle(id, search, community);

            expect(mockPostRepository.createQueryBuilder().where).toHaveBeenCalledWith("post.createdBy = :createdBy", {
                createdBy: id,
            });
            expect(mockPostRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith("post.title ILIKE :title", {
                title: `%${search}%`,
            });
            expect(mockPostRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
                "post.communityType = :type",
                {
                    type: community,
                },
            );
            expect(mockPostRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
                "post.delete.isDeleted = :isDeleted",
                {
                    isDeleted: false,
                },
            );
            expect(mockPostRepository.createQueryBuilder().getOne).toHaveBeenCalled();
        });

        it("find one post should be success", async () => {
            const options = {
                where: {
                    id: "1",
                },
            };

            jest.spyOn(mockPostRepository.createQueryBuilder(), "getRawOne").mockResolvedValueOnce(
                mockResultPostEntity,
            );
            jest.spyOn(mockCommentService, "findAllCommentByPostId").mockResolvedValueOnce(mockResultCommentEntity);
            await postService.findOnePost(options);

            expect(mockPostRepository.createQueryBuilder().where).toHaveBeenCalledWith("post.isDeleted = :isDeleted", {
                isDeleted: false,
            });
            expect(mockPostRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith("post.id = :id", {
                id: "1",
            });
        });

        it("find all comment by post id should be success", async () => {
            const id = "1";
            const query = {
                perPage: "10",
                page: "1",
            } as FindAllCommentDto;

            jest.spyOn(mockCommentService, "findAllCommentByPostId").mockResolvedValueOnce(mockResultCommentEntity);
            await postService.findAllCommentByPostId(id, query);

            expect(mockCommentService.findAllCommentByPostId).toHaveBeenCalledWith("1", query);
        });
    });
});
