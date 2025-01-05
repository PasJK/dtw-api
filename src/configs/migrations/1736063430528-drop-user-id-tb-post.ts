import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUserIdTbPost1736063430528 implements MigrationInterface {
    name = "DropUserIdTbPost1736063430528";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_POST_USER_ID"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "user_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_POST_USER_ID" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
