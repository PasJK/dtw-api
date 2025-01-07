import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTbCommunityType1736066914656 implements MigrationInterface {
    name = "CreateTbCommunityType1736066914656";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "community_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(250) NOT NULL, "key" character varying(250) NOT NULL, CONSTRAINT "PK_1766a03827f24ca15d999918ef6" PRIMARY KEY ("id"))`,
        );

        await queryRunner.query(`
            INSERT INTO "community_types" ("name", "key") 
            VALUES 
                ('Community', 'all'),
                ('Group', 'group'),
                ('History', 'history'),
                ('Food', 'food'),
                ('Pets', 'pets'),
                ('Health', 'health'),
                ('Fashion', 'fashion'),
                ('Exercise', 'exercise'),
                ('Others', 'others')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "community_types"`);
    }
}
