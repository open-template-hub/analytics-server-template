/**
 * @description holds context interface
 */

import { UserRole } from '../enum/user-role.enum';
import { MongoDbProvider } from '../provider/mongo.provider';

export interface Context {
  mongodb_provider: MongoDbProvider;
  role: UserRole;
  isAdmin: boolean;
  username: string;
  serviceKey: string;
}
