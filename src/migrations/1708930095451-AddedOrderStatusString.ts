import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOrderStatusString1708930095451 implements MigrationInterface {
    name = 'AddedOrderStatusString1708930095451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "status" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
    }

}
