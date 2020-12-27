/**
 * @description holds preload util
 */

import { MongoDbProvider } from '../provider/mongo.provider';

export class PreloadUtil {
  /**
   * preloads db provider
   * @param mongoDbProvider mongodb provider
   */
  preload = async (mongoDbProvider: MongoDbProvider) => {
    await mongoDbProvider.preload();
  };
}
