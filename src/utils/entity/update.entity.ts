import { Exclude } from "class-transformer";
import { UpdateDateColumn, Column } from "typeorm";

export class UpdateEntity {
    @Exclude()
    @UpdateDateColumn({
        type: "timestamp",
        name: "updated_at",
        onUpdate: "CURRENT_TIMESTAMP",
        nullable: true,
        default: null,
    })
    updatedAt: Date;

    @Exclude()
    @Column({
        type: "uuid",
        name: "updated_by",
        nullable: true,
        default: null,
    })
    updatedBy: string;
}
