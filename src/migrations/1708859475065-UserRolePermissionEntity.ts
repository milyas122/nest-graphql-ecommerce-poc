import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolePermissionEntity1708859475065
  implements MigrationInterface
{
  name = 'UserRolePermissionEntity1708859475065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "permission" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_96c8f1fd25538d3692024115b47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission_users_user" ("rolePermissionId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_146e6cd3e9ccd77252934c3bcb1" PRIMARY KEY ("rolePermissionId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2abbbe4120806ab2b3514ff5d2" ON "role_permission_users_user" ("rolePermissionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6464709c95f564839024956972" ON "role_permission_users_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_users_user" ADD CONSTRAINT "FK_2abbbe4120806ab2b3514ff5d20" FOREIGN KEY ("rolePermissionId") REFERENCES "role_permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_users_user" ADD CONSTRAINT "FK_6464709c95f564839024956972d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permission_users_user" DROP CONSTRAINT "FK_6464709c95f564839024956972d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission_users_user" DROP CONSTRAINT "FK_2abbbe4120806ab2b3514ff5d20"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6464709c95f564839024956972"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2abbbe4120806ab2b3514ff5d2"`,
    );
    await queryRunner.query(`DROP TABLE "role_permission_users_user"`);
    await queryRunner.query(`DROP TABLE "role_permission"`);
  }
}
