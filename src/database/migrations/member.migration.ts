import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class MemberRefactoring1655293857013 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('member_entity', 'nickname')
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'member_entity',
            new TableColumn({ name: 'nickname', type: 'text', default: '"???"' })
        )
    }
}
