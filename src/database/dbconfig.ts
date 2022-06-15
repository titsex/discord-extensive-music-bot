import { DataSource } from 'typeorm'

export default new DataSource({
    type: 'postgres',
    url: 'postgres://postgres:Artvilkilk23@localhost/DiscordMusic',
    entities: ['build/**/*.entity.js'],
    migrations: ['build/**/*.migration.js'],
    migrationsTableName: 'custom_migration',
    synchronize: true,
    logging: ['error'],
    cache: true,
})
