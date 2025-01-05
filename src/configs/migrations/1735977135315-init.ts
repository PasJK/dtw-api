import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1735977135315 implements MigrationInterface {
    name = "Init1735977135315";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TABLE \"auth_token\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"user_id\" uuid NOT NULL, \"user_agent\" character varying(255), \"access_token\" text NOT NULL, \"refresh_token\" text, \"access_token_expired_at\" TIMESTAMP NOT NULL, \"refresh_token_expired_at\" TIMESTAMP, \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"created_by\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', \"updated_at\" TIMESTAMP DEFAULT now(), \"updated_by\" uuid, CONSTRAINT \"PK_4572ff5d1264c4a523f01aa86a0\" PRIMARY KEY (\"id\"))",
        );
        await queryRunner.query("CREATE INDEX \"AUTH_TOKEN_ID_INDEX\" ON \"auth_token\" (\"id\") ");
        await queryRunner.query(
            "CREATE TABLE \"comments\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"post_id\" uuid NOT NULL, \"user_id\" uuid NOT NULL, \"message\" text NOT NULL, \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"created_by\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', \"updated_at\" TIMESTAMP DEFAULT now(), \"updated_by\" uuid, \"is_deleted\" boolean NOT NULL DEFAULT false, \"deleted_at\" TIMESTAMP, \"deleted_by\" uuid, CONSTRAINT \"PK_8bf68bc960f2b69e818bdb90dcb\" PRIMARY KEY (\"id\"))",
        );
        await queryRunner.query(
            "CREATE TABLE \"posts\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"community_type\" character varying(150) NOT NULL, \"title\" character varying(255) NOT NULL, \"contents\" text NOT NULL, \"status\" character varying(50) NOT NULL DEFAULT 'public', \"last_activity_at\" TIMESTAMP NOT NULL, \"user_id\" uuid, \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"created_by\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', \"updated_at\" TIMESTAMP DEFAULT now(), \"updated_by\" uuid, \"is_deleted\" boolean NOT NULL DEFAULT false, \"deleted_at\" TIMESTAMP, \"deleted_by\" uuid, CONSTRAINT \"PK_2829ac61eff60fcec60d7274b9e\" PRIMARY KEY (\"id\"))",
        );
        await queryRunner.query(
            "CREATE TABLE \"users\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"email\" character varying(120) NOT NULL, \"password\" character varying(255), \"first_name\" character varying(60), \"last_name\" character varying(120), \"full_name\" character varying(180), \"last_login\" TIMESTAMP, \"is_active\" boolean NOT NULL DEFAULT false, \"status\" character varying(50) NOT NULL DEFAULT 'pending', \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"created_by\" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', \"updated_at\" TIMESTAMP DEFAULT now(), \"updated_by\" uuid, \"is_deleted\" boolean NOT NULL DEFAULT false, \"deleted_at\" TIMESTAMP, \"deleted_by\" uuid, CONSTRAINT \"PK_a3ffb1c0c8416b9fc6f907b7433\" PRIMARY KEY (\"id\"))",
        );
        await queryRunner.query(
            "CREATE TABLE \"configurations\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"refresh_token_expired_time\" character varying(50) DEFAULT '7d', \"access_token_expired_time\" character varying(50) DEFAULT '1h', \"common_link_expired_time\" character varying NOT NULL DEFAULT '7d', \"invite_link_expired_time\" character varying NOT NULL DEFAULT '7d', \"forgot_password_link_expired_time\" character varying NOT NULL DEFAULT '7d', \"client_inactivity_time\" integer NOT NULL DEFAULT '1800000', CONSTRAINT \"PK_ef9fc29709cc5fc66610fc6a664\" PRIMARY KEY (\"id\")); COMMENT ON COLUMN \"configurations\".\"client_inactivity_time\" IS 'milliseconds default 30 minutes'",
        );
        await queryRunner.query(
            "ALTER TABLE \"auth_token\" ADD CONSTRAINT \"FK_26b580c89e141c75426f44317bc\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
        );
        await queryRunner.query(
            "ALTER TABLE \"comments\" ADD CONSTRAINT \"FK_COMMENT_POST_ID\" FOREIGN KEY (\"post_id\") REFERENCES \"posts\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
        );
        await queryRunner.query(
            "ALTER TABLE \"comments\" ADD CONSTRAINT \"FK_COMMENT_USER_ID\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
        );
        await queryRunner.query(
            "ALTER TABLE \"posts\" ADD CONSTRAINT \"FK_POST_USER_ID\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION",
        );

        await queryRunner.query(
            "INSERT INTO \"configurations\" (\"refresh_token_expired_time\", \"access_token_expired_time\", \"common_link_expired_time\", \"invite_link_expired_time\", \"forgot_password_link_expired_time\", \"client_inactivity_time\") VALUES ('7d', '1h', '7d', '7d', '7d', 1800000)",
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"posts\" DROP CONSTRAINT \"FK_POST_USER_ID\"");
        await queryRunner.query("ALTER TABLE \"comments\" DROP CONSTRAINT \"FK_COMMENT_USER_ID\"");
        await queryRunner.query("ALTER TABLE \"comments\" DROP CONSTRAINT \"FK_COMMENT_POST_ID\"");
        await queryRunner.query("ALTER TABLE \"auth_token\" DROP CONSTRAINT \"FK_26b580c89e141c75426f44317bc\"");
        await queryRunner.query("DROP TABLE \"configurations\"");
        await queryRunner.query("DROP TABLE \"users\"");
        await queryRunner.query("DROP TABLE \"posts\"");
        await queryRunner.query("DROP TABLE \"comments\"");
        await queryRunner.query("DROP INDEX \"public\".\"AUTH_TOKEN_ID_INDEX\"");
        await queryRunner.query("DROP TABLE \"auth_token\"");
    }
}
