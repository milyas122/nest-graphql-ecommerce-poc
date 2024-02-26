import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserRoleEnumAddStringRole1708930586099 implements MigrationInterface {
    name = 'RemoveUserRoleEnumAddStringRole1708930586099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'seller', 'buyer')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL`);
    }

}
