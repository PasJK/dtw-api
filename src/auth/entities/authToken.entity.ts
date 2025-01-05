import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "@user/entities/user.entity";
import { CreateEntity, UpdateEntity } from "@utils/entity";

@Entity({ name: "auth_token" })
export class AuthTokenEntity {
    @Index("AUTH_TOKEN_ID_INDEX")
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", name: "user_id" })
    userId: string;

    @Column({ type: "varchar", length: 255, name: "user_agent", nullable: true })
    userAgent: string;

    @Column({ type: "text", name: "access_token" })
    accessToken: string;

    @Column({ type: "text", name: "refresh_token", nullable: true })
    refreshToken: string;

    @Column({ type: "timestamp", name: "access_token_expired_at" })
    accessTokenExpiredAt: Date;

    @Column({ type: "timestamp", name: "refresh_token_expired_at", nullable: true })
    refreshTokenExpiredAt: Date;

    @Column(() => CreateEntity, { prefix: false })
    create: CreateEntity;

    @Column(() => UpdateEntity, { prefix: false })
    update: UpdateEntity;

    @ManyToOne(() => UserEntity, user => user)
    @JoinColumn({ name: "user_id" })
    user: UserEntity;
}
