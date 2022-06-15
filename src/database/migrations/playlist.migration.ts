import { MigrationInterface, QueryRunner } from 'typeorm'

export class PlaylistRefactoring1655293858013 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('playlist_entity')
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE playlist_entity (
                                                        id INT PRIMARY KEY, 
                                                        title TEXT, 
                                                        ownerId INT,
                                                        channelId INT,
                                                        public BOOLEAN,
                                                        songs TEXT
                                                     );
        `)
    }
}
