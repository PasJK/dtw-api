import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDropUseridTbComment1736088264626 implements MigrationInterface {
    name = 'AlterDropUseridTbComment1736088264626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_COMMENT_USER_ID"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_COMMENT_USER_ID" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
