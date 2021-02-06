import { ConnectionOptions, createConnections } from 'typeorm';
import path from 'path';

const getMongoConnection = (): ConnectionOptions =>
  process.env.NODE_ENV === 'production'
    ? {
        name: 'mongo',
        type: 'mongodb',
        url: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}`,
        useNewUrlParser: true,
        synchronize: true,
        logging: true,
        useUnifiedTopology: true,
        entities: [path.resolve(__dirname, '**', 'schemas', '*.*')],
      }
    : {
        name: 'mongo',
        type: 'mongodb',
        host: process.env.MONGO_HOST,
        port: parseInt(process.env.MONGO_PORT || '27017', 10),
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASS,
        database: process.env.MONGO_DATABASE,
        useUnifiedTopology: true,
        entities: [path.resolve(__dirname, '**', 'schemas', '*.*')],
      };
export default async function (): Promise<void> {
  await createConnections([
    {
      name: 'default',
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DATABASE,
      entities: [path.resolve(__dirname, '**', 'entities', '*.*')],

      // ssl: process.env.NODE_ENV === 'production',
      extra: {
        ssl: {
          rejectUnauthorized: process.env.NODE_ENV !== 'production',
        },
      },
    },
    getMongoConnection(),
  ]);
}
