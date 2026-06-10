import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryImageOnDeleteSetNull1781079692980 implements MigrationInterface {
    name = 'AddCategoryImageOnDeleteSetNull1781079692980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_5336de31c6bef5b1e543d66d2bc"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_5336de31c6bef5b1e543d66d2bc" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_5336de31c6bef5b1e543d66d2bc"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_5336de31c6bef5b1e543d66d2bc" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
