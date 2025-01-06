import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFkUserTbPost1736096894042 implements MigrationInterface {
    name = 'AlterFkUserTbPost1736096894042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "created_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "created_by" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_POST_CREATED_BY" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_POST_CREATED_BY"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "created_by" SET DEFAULT '00000000-0000-0000-0000-000000000000'`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "created_by" SET NOT NULL`);
    }

}
