import { Repository } from "typeorm";
import Config from "@configs/config";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "@post/entities/post.entity";

@Injectable()
export class PostServiceV1 {
    constructor(
        @InjectRepository(PostEntity, Config.getInstantConfig().DB_CONNECTION_NAME)
        private postRepository: Repository<PostEntity>,
    ) {}
}
