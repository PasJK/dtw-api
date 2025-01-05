import { Exclude } from "class-transformer";
import { Column } from "typeorm";

export class DeleteEntity {
    @Exclude()
    @Column({ type: "boolean", name: "is_deleted", default: false, select: false })
    isDeleted: boolean;

    @Exclude()
    @Column({
        type: "timestamp",
        name: "deleted_at",
        nullable: true,
        default: null,
        onUpdate: "CURRENT_TIMESTAMP",
        select: false,
    })
    deletedAt: Date;

    @Exclude()
    @Column({ type: "uuid", name: "deleted_by", nullable: true, default: null, select: false })
    deletedBy: string;
}
