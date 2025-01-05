import { Exclude } from "class-transformer";
import { Column } from "typeorm";

export class CreateEntity {
    @Column({
        type: "timestamp",
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP",
    })
    createdAt: Date;

    @Exclude()
    @Column({ type: "uuid", name: "created_by", default: "00000000-0000-0000-0000-000000000000" })
    createdBy: string;
}
