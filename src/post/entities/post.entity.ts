import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentEntity } from "@comment/entities/comment.entity";
import { UserEntity } from "@user/entities/user.entity";
import { DeleteEntity, UpdateEntity } from "@utils/entity";

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

    @Column({
        type: "timestamp",
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP",
    })
    createdAt: Date;

    @Column({ type: "uuid", name: "created_by" })
    createdBy: string;

    @Column(() => UpdateEntity, { prefix: false })
    update: UpdateEntity;

    @Column(() => DeleteEntity, { prefix: false })
    delete: DeleteEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.post)
    comments: CommentEntity[];

    @ManyToOne(() => UserEntity, (user) => user.posts)
    @JoinColumn({ name: "created_by", foreignKeyConstraintName: "FK_POST_CREATED_BY" })
    user: UserEntity;
}
