import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "@post/entities/post.entity";
import { CreateEntity, DeleteEntity, UpdateEntity } from "@utils/entity";

@Entity({ name: "comments" })
export class CommentEntity {
    @Exclude()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", name: "post_id" })
    postId: string;

    @Column({ type: "text" })
    message: string;

    @Column(() => CreateEntity, { prefix: false })
    create: CreateEntity;

    @Column(() => UpdateEntity, { prefix: false })
    update: UpdateEntity;

    @Column(() => DeleteEntity, { prefix: false })
    delete: DeleteEntity;

    @ManyToOne(() => PostEntity, (post) => post.comments)
    @JoinColumn({ name: "post_id", foreignKeyConstraintName: "FK_COMMENT_POST_ID" })
    post: PostEntity;
}
