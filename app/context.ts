/**
 * @description holds context
 */

import { AuthUtil } from './util/auth.util';
import { MongoDbProvider } from './provider/mongo.provider';
import { Context } from './interface/context.interface';
import { TokenUtil } from './util/token.util';
import { UserRole } from './enum/user-role.enum';
import { ErrorMessage } from './constant';

export const context = async (
  req: any,
  mongodb_provider: MongoDbProvider,
  publicPaths: string[],
  adminPaths: string[]
) => {
  const tokenUtil = new TokenUtil();
  const authUtil = new AuthUtil(tokenUtil);

  let currentUser: any;
  let publicPath = false;
  let adminPath = false;

  publicPaths.forEach((p) => {
    if (req.path === p) {
      publicPath = true;
      return;
    }
  });

  adminPaths.forEach((p) => {
    if (req.path === p) {
      adminPath = true;
      return;
    }
  });

  if (!publicPath) {
    currentUser = await authUtil.getCurrentUser(req);
  }

  const serviceKey = req.body.key;

  const role = currentUser ? (currentUser.role as UserRole) : ('' as UserRole);
  const isAdmin = authUtil.isAdmin(role);

  if (adminPath && !isAdmin) {
    throw new Error(ErrorMessage.FORBIDDEN);
  }

  return {
    mongodb_provider,
    username: currentUser ? currentUser.username : '',
    role,
    isAdmin,
    serviceKey,
  } as Context;
};
