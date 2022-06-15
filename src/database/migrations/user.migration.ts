import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class UserRefactoring1655293859013 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('user_entity', ['name'])
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('user_entity', [new TableColumn({ name: 'name', type: 'text', default: '"???"' })])
    }
}
