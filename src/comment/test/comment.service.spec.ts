import { Test, TestingModule } from "@nestjs/testing";
import { CommentEntity } from "@comment/entities/comment.entity";
import { CommentServiceV1 } from "@comment/v1/comment.service";
import Config from "@configs/config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FindAllCommentDto } from "@post/v1/dto/findAllComment.dto";
import { createMockRepository } from "@testUtils/mockQueryBuilder";

describe("CommentServiceV1", () => {
    const mockRepository = createMockRepository<CommentEntity>();
    let commentService: CommentServiceV1;
    let mockDate = new Date();

    beforeEach(async () => {
        mockDate = new Date("2025-08-07 00:00:00");
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentServiceV1,
                {
                    provide: getRepositoryToken(CommentEntity, Config.getInstantConfig().DB_CONNECTION_NAME),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        commentService = module.get<CommentServiceV1>(CommentServiceV1);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(commentService).toBeDefined();
    });

    it("should create a comment", async () => {
        const creatorId = "123";
        const postId = "456";
        const message = "This is a test comment";

        await commentService.create(creatorId, postId, message);

        expect(mockRepository.create).toHaveBeenCalledWith({
            message,
            postId,
            create: {
                createdBy: creatorId,
                createdAt: mockDate,
            },
            update: {
                updatedBy: creatorId,
                updatedAt: mockDate,
            },
        });
    });

    it("should find all comments by post id", async () => {
        const postId = "456";
        const query = { perPage: "10", page: "1" } as FindAllCommentDto;
        const mockResultCommentEntity = [
            {
                id: "1",
                message: "This is a test comment",
                createdAt: mockDate,
                author: "John Doe",
            },
        ];

        jest.spyOn(mockRepository.createQueryBuilder(), "getRawMany").mockResolvedValueOnce(mockResultCommentEntity);

        await commentService.findAllCommentByPostId(postId, query);
        expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("comment");
    });
});
