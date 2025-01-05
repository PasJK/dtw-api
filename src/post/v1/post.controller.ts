import { Controller } from "@nestjs/common";
import { PostServiceV1 } from "./post.service";

@Controller("posts")
export class PostController {
    constructor(private readonly postService: PostServiceV1) {}
}
