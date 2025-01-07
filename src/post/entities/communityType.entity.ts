import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "community_types" })
export class CommunityTypeEntity {
    @Exclude()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 250 })
    name: string;

    @Column({ type: "varchar", length: 250 })
    key: string;

    @Column({ type: "int", default: 0 })
    priority: number;
}
