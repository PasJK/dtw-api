import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterEmailToUsername1736058979423 implements MigrationInterface {
    name = "AlterEmailToUsername1736058979423";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "email" TO "username"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(150) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "username" TO "email"`);
    }
}
