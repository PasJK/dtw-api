import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { HttpResponse } from "@utils/http-services/httpResponse";
import { SERVICE_STATUS } from "@utils/http-services/interfaces/serviceStatus.interface";
import { RequestWithAuth } from "@utils/interface/requestWithAuth.interface";
import { FindAllPostDto } from "./dto/findAllPost.dto";
import { StorePostDto } from "./dto/storePost.dto";
import { PostServiceV1 } from "./post.service";

@Controller("posts")
export class PostController {
    constructor(private readonly postService: PostServiceV1) {}

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

    @Get(":id")
    async getPost(@Req() req: RequestWithAuth, @Param("id") id: string) {
        const post = await this.postService.findOnePost({ where: { id } });

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
            data: post,
        });
    }

    @Get("communities/dropdown")
    async getCommunityDropdown() {
        const communityTypeList = await this.postService.getCommunityDropdown();

        return HttpResponse.res({
            serviceStatus: SERVICE_STATUS.SUCCESS,
            data: communityTypeList,
        });
    }
}
