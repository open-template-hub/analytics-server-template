import { MongoDbProvider } from '../provider/mongo.provider';

export const preload = async (mongoDbProvider: MongoDbProvider) => {
  await mongoDbProvider.preload();
};
