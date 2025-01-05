import { Controller } from "@nestjs/common";
import { CommentServiceV1 } from "./comment.service";

@Controller("comments")
export class CommentController {
    constructor(private readonly commentService: CommentServiceV1) {}
}
