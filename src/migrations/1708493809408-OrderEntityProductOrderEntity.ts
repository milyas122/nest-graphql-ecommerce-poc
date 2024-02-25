import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderEntityProductOrderEntity1708493809408
  implements MigrationInterface
{
  name = 'OrderEntityProductOrderEntity1708493809408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TYPE order_status_enum AS ENUM ('processing', 'shipped', 'delivered', 'cancelled');`);
    await queryRunner.query(
      `CREATE TABLE "product_order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "total_price" numeric NOT NULL, "productId" uuid, "orderId" uuid, CONSTRAINT "PK_9849f0d8ce095e50e752616f691" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" character varying NOT NULL, "status" order_status_enum NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "buyerId" uuid, CONSTRAINT "UQ_58998c5eaeaacdd004dec8b5d86" UNIQUE ("order_id"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_order" ADD CONSTRAINT "FK_717057f3f11a007030181422152" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_order" ADD CONSTRAINT "FK_42291ebe165058deecb017e652b" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TYPE order_status_enum
      `);
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_order" DROP CONSTRAINT "FK_42291ebe165058deecb017e652b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_order" DROP CONSTRAINT "FK_717057f3f11a007030181422152"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "product_order"`);
  }
}
