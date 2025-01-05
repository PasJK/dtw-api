import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentEntity } from "@comment/entities/comment.entity";
import { UserEntity } from "@user/entities/user.entity";
import { CreateEntity, DeleteEntity, UpdateEntity } from "@utils/entity";

@Entity({ name: "posts" })
export class PostEntity {
    @Exclude()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", name: "community_type", length: 150 })
    communityType: string;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "text" })
    contents: string;

    @Column({ type: "varchar", length: 50, default: "public" })
    status: string;

    @Column({ type: "timestamp", name: "last_activity_at" })
    lastActivityAt: Date;

    @Column(() => CreateEntity, { prefix: false })
    create: CreateEntity;

    @Column(() => UpdateEntity, { prefix: false })
    update: UpdateEntity;

    @Column(() => DeleteEntity, { prefix: false })
    delete: DeleteEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.post)
    @JoinColumn({ name: "post_id", foreignKeyConstraintName: "FK_POST_POST_ID" })
    comments: CommentEntity[];

    @ManyToOne(() => UserEntity, (user) => user.posts)
    @JoinColumn({ name: "user_id", foreignKeyConstraintName: "FK_POST_USER_ID" })
    user: UserEntity;
}
