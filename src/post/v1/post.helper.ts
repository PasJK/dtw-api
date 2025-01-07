import { Repository } from "typeorm";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "@post/entities/post.entity";
import { ErrorObject } from "@utils/http-services/errorObject";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";

@Injectable()
export class PostHelperServiceV1 {
    constructor(
        @InjectRepository(PostEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private postRepository: Repository<PostEntity>,
    ) {}

    async verifyPost(postId: string) {
        const post = await this.postRepository.findOne({ select: ["id"], where: { id: postId } });

        if (!post) {
            throw new ErrorObject({
                ...SERVICE_STATUS.SERVICE_BAD_REQUEST,
                message: "Post not found",
            });
        }
    }
}
