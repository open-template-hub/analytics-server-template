import {
  router as monitorRouter,
  publicRoutes as monitorPublicRoutes,
} from './monitor.route';
import {
  router as eventRouter,
  adminRoutes as eventAdminRoutes,
} from './event.route';
import { Request, Response } from 'express';
import { context } from '../context';
import { handle } from '../util/error-handler.util';
import { EncryptionService } from '../util/encryption.util';
import { MongoDbProvider } from '../provider/mongo.provider';
import { preload } from '../util/preload.util';
import { debugLog } from '../util/debug-log.util';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  event: '/event',
};

export module Routes {
  const mongodb_provider = new MongoDbProvider();
  var publicRoutes: string[] = [];
  var adminRoutes: string[] = [];

  function populateRoutes(mainRoute, routes) {
    var populated = Array<string>();
    for (var i = 0; i < routes.length; i++) {
      const s = routes[i];
      populated.push(mainRoute + (s === '/' ? '' : s));
    }

    return populated;
  }

  export const mount = (app: any) => {
    preload(mongodb_provider).then(() =>
      console.log('DB preload is completed.')
    );

    publicRoutes = [...populateRoutes(subRoutes.monitor, monitorPublicRoutes)];
    console.log('Public Routes: ', publicRoutes);

    adminRoutes = [...populateRoutes(subRoutes.event, eventAdminRoutes)];
    console.log('Admin Routes: ', adminRoutes);

    const responseInterceptor = (req, res, next) => {
      let originalSend = res.send;
      const service = new EncryptionService();
      res.send = function () {
        debugLog('Starting Encryption: ', new Date());
        let encrypted_arguments = service.encrypt(arguments);
        debugLog('Encryption Completed: ', new Date());

        originalSend.apply(res, encrypted_arguments);
      };

      next();
    };

    // Use this interceptor before routes
    app.use(responseInterceptor);

    // INFO: Keep this method at top at all times
    app.all('/*', async (req: Request, res: Response, next) => {
      try {
        // create context
        res.locals.ctx = await context(
          req,
          mongodb_provider,
          publicRoutes,
          adminRoutes
        );

        next();
      } catch (err) {
        let error = handle(err);
        res.status(error.code).json({ message: error.message });
      }
    });

    // INFO: Add your routes here
    app.use(subRoutes.monitor, monitorRouter);
    app.use(subRoutes.event, eventRouter);

    // Use for error handling
    app.use(function (err, req, res, next) {
      let error = handle(err);
      res.status(error.code).json({ message: error.message });
    });
  };
}
