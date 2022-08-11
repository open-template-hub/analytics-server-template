/**
 * @description holds system info routes
 */

import {
  ResponseCode,
} from '@open-template-hub/common';
import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { SystemInfoController } from '../controller/system-info.controller';

const subRoutes = {
  root: '/',
};

export const router = Router();

router.get(
    subRoutes.root,
    async ( req: Request, res: Response ) => {
      const systemInfoController = new SystemInfoController();
      let response = await systemInfoController.getNpmDownloads( res.locals.ctx, req.query.key );
      res.status( ResponseCode.OK ).json( response.value );
    }
);
