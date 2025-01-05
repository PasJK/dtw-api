import { Exclude } from "class-transformer";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AuthTokenEntity } from "@auth/entities/authToken.entity";
import { CommentEntity } from "@comment/entities/comment.entity";
import { Optional } from "@nestjs/common";
import { PostEntity } from "@post/entities/post.entity";
import { CreateEntity, DeleteEntity, UpdateEntity } from "@utils/entity";

@Entity({ name: "users" })
export class UserEntity {
    @Exclude()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 150, nullable: false })
    username: string;

    @Exclude()
    @Column({ type: "varchar", length: 255, select: false, nullable: true, default: null })
    password: string;

    @Column({ type: "varchar", name: "first_name", length: 60, nullable: true, default: null })
    firstName: string;

    @Column({ type: "varchar", name: "last_name", length: 120, nullable: true, default: null })
    lastName: string;

    @Column({ type: "varchar", name: "full_name", length: 180, nullable: true, default: null })
    fullName: string;

    @BeforeInsert()
    @BeforeUpdate()
    setFullName() {
        this.fullName = `${this.firstName || ""} ${this.lastName || ""}`.trim();
    }

    @Column({ type: "timestamp", name: "last_login", nullable: true, default: null })
    lastLogin: Date;

    @Exclude()
    @Column({ type: "boolean", name: "is_active", default: false, select: false })
    isActive: boolean;

    @Column({ type: "varchar", length: 50, default: "pending" })
    status: string;

    @Column(() => CreateEntity, { prefix: false })
    create: CreateEntity;

    @Optional()
    @Column(() => UpdateEntity, { prefix: false })
    update: UpdateEntity;

    @Column(() => DeleteEntity, { prefix: false })
    delete: DeleteEntity;

    @OneToMany(() => AuthTokenEntity, (authToken) => authToken.user)
    authTokens: AuthTokenEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.user)
    comments: CommentEntity[];
}
