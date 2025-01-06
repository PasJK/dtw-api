import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterPriorityTbCommuType1736179560263 implements MigrationInterface {
    name = "AlterPriorityTbCommuType1736179560263";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community_types" ADD "priority" integer NOT NULL DEFAULT '0'`);

        await queryRunner.query(`TRUNCATE TABLE "community_types"`);
        await queryRunner.query(`
            INSERT INTO "community_types" ("name", "key", "priority") 
            VALUES 
                ('Community', 'all', 1),
                ('History', 'history', 2),
                ('Food', 'food', 3),
                ('Pets', 'pets', 4),
                ('Health', 'health', 5),
                ('Fashion', 'fashion', 6),
                ('Exercise', 'exercise', 7),
                ('Others', 'others', 8)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community_types" DROP COLUMN "priority"`);
    }
}
