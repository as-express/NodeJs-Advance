import { DataSource } from 'typeorm';

const databaseConfig = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'as-express',
  password: process.env.DATABASE_PASSWORD || '1234',
  database: process.env.DATABASE_NAME || 'express',
  synchronize: true,
  logging: false,
  entities: [__dirname + '/entities/*.ts'],
});

export default databaseConfig;
