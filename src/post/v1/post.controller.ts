import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseFilters } from "@nestjs/common";
import { Public } from "@utils/decorator";
import { HttpExceptionFilter } from "@utils/http-services/httpException";
import { HttpResponse } from "@utils/http-services/httpResponse";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";
import { RequestWithAuth } from "@utils/interface/requestWithAuth.interface";
import { CreateCommentDto } from "./dto/createComment.dto";
import { FindAllCommentDto } from "./dto/findAllComment.dto";
import { FindAllPostDto } from "./dto/findAllPost.dto";
import { StorePostDto } from "./dto/storePost.dto";
import { PostServiceV1 } from "./post.service";

@Controller("posts")
@UseFilters(new HttpExceptionFilter())
export class PostController {
    constructor(private readonly postService: PostServiceV1) {}

    @Public()
    @Get()
    async getAllPosts(@Req() req: RequestWithAuth, @Query() query: FindAllPostDto): Promise<HttpResponse> {
        const requester = req?.user;
        const { data, meta } = await this.postService.getAllPosts(requester, query);

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
            data,
            meta,
        });
    }

    @Post()
    async createPost(@Req() req: RequestWithAuth, @Body() body: StorePostDto) {
        const requester = req?.user;
        const post = await this.postService.createPost(requester, body);

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
            data: post,
        });
    }

    @Patch(":id")
    async updatePost(@Req() req: RequestWithAuth, @Param("id") id: string, @Body() body: StorePostDto) {
        const requester = req?.user;
        const post = await this.postService.updatePost(requester, id, body);

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
            data: post,
        });
    }

    @Delete(":id")
    async deletePost(@Req() req: RequestWithAuth, @Param("id") id: string) {
        const requester = req?.user;
        await this.postService.softDeletePost(requester, id);

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
        });
    }

    @Public()
    @Get(":id")
    async getPost(@Param("id") id: string) {
        const post = await this.postService.findOnePost({ where: { id } });

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
            data: post,
        });
    }

    @Public()
    @Get(":id/comments")
    async getPostComments(@Query() query: FindAllCommentDto, @Param("id") id: string) {
        const { data, meta } = await this.postService.findAllCommentByPostId(id, query);

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
            data,
            meta,
        });
    }

    @Public()
    @Get("communities/dropdown")
    async getCommunityDropdown() {
        const communityTypeList = await this.postService.getCommunityDropdown();

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
            data: communityTypeList,
        });
    }

    @Post(":postId/comment")
    async createComment(@Req() req: RequestWithAuth, @Param("postId") postId: string, @Body() body: CreateCommentDto) {
        const requester = req?.user;
        await this.postService.createComment(requester, postId, body);

        return HttpResponse.res({ serviceStatus: SERVICE_STATUS.SUCCESS });
    }
}
