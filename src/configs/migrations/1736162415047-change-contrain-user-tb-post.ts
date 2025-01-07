import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeContrainUserTbPost1736162415047 implements MigrationInterface {
    name = 'ChangeContrainUserTbPost1736162415047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_POST_CREATED_BY"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "created_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_POST_CREATED_BY" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_POST_CREATED_BY"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "created_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_POST_CREATED_BY" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
