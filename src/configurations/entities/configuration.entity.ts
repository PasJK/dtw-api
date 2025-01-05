import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "configurations" })
export class ConfigurationEntity {
    @Exclude()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 50, name: "refresh_token_expired_time", default: "7d", nullable: true })
    refreshTokenExpiredTime: string;

    @Column({ type: "varchar", length: 50, name: "access_token_expired_time", default: "1h", nullable: true })
    accessTokenExpiredTime: string;

    @Column({ type: "varchar", name: "common_link_expired_time", default: "7d" })
    commonLinkExpiredTime: string;

    @Column({ type: "varchar", name: "invite_link_expired_time", default: "7d" })
    inviteLinkExpiredTime: string;

    @Column({ type: "varchar", name: "forgot_password_link_expired_time", default: "7d" })
    forgotPasswordLinkExpiredTime: string;

    @Column({
        type: "int",
        name: "client_inactivity_time",
        default: 30 * 60 * 1000,
        comment: "milliseconds default 30 minutes",
    })
    clientInactivityTime: number;
}
