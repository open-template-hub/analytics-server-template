import {
  context,
  DebugLogUtil,
  EncryptionUtil,
  ErrorHandlerUtil,
  MongoDbProvider,
  PreloadUtil,
} from '@open-template-hub/common';
import { NextFunction, Request, Response } from 'express';
import { Environment } from '../../environment';
import { adminRoutes as eventAdminRoutes, router as eventRouter, } from './event.route';
import { publicRoutes as monitorPublicRoutes, router as monitorRouter, } from './monitor.route';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  event: '/event',
};

export namespace Routes {
  const errorHandlerUtil = new ErrorHandlerUtil();
  const debugLogUtil = new DebugLogUtil();
  var mongodb_provider: MongoDbProvider;
  var environment: Environment;
  var publicRoutes: string[] = [];
  var adminRoutes: string[] = [];

  function populateRoutes( mainRoute: string, routes: Array<string> ) {
    var populated = Array<string>();
    for ( const s of routes ) {
      populated.push( mainRoute + ( s === '/' ? '' : s ) );
    }

    return populated;
  }

  export const mount = ( app: any ) => {
    environment = new Environment();
    mongodb_provider = new MongoDbProvider( environment.args() );
    const preloadUtil = new PreloadUtil();

    preloadUtil
    .preload( mongodb_provider )
    .then( () => console.log( 'DB preload is completed.' ) );

    publicRoutes = [ ...populateRoutes( subRoutes.monitor, monitorPublicRoutes ) ];
    console.log( 'Public Routes: ', publicRoutes );

    adminRoutes = [ ...populateRoutes( subRoutes.event, eventAdminRoutes ) ];
    console.log( 'Admin Routes: ', adminRoutes );

    const responseInterceptor = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
      let originalSend = res.send;
      const encryptionUtil = new EncryptionUtil( environment.args() );
      res.send = function () {
        debugLogUtil.log( 'Starting Encryption: ', new Date() );
        let encrypted_arguments = encryptionUtil.encrypt( arguments );
        debugLogUtil.log( 'Encryption Completed: ', new Date() );

        originalSend.apply( res, encrypted_arguments as any );
      } as any;

      next();
    };

    // Use this interceptor before routes
    app.use( responseInterceptor );

    // INFO: Keep this method at top at all times
    app.all( '/*', async ( req: Request, res: Response, next: NextFunction ) => {
      try {
        // create context
        res.locals.ctx = await context(
            req,
            environment.args(),
            publicRoutes,
            adminRoutes,
            mongodb_provider
        );

        next();
      } catch ( err ) {
        let error = errorHandlerUtil.handle( err );
        res.status( error.code ).json( { message: error.message } );
      }
    } );

    // INFO: Add your routes here
    app.use( subRoutes.monitor, monitorRouter );
    app.use( subRoutes.event, eventRouter );

    // Use for error handling
    app.use( function (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
      let error = errorHandlerUtil.handle( err );
      res.status( error.code ).json( { message: error.message } );
    } );
  };
}
