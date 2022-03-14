import {
  ContextArgs,
  MountArgs,
  MountAssets,
  Route,
  RouteArgs,
  mount as mountApp,
} from '@open-template-hub/common';
import { Environment } from '../../environment';
import { AnalyticsQueueConsumer } from '../consumer/analytics-queue.consumer';
import { router as eventRouter } from './event.route';
import { router as monitorRouter } from './monitor.route';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  event: '/event',
};

export namespace Routes {
  export const mount = (app: any) => {
    const envArgs = new Environment().args();

    const ctxArgs = {
      envArgs,
      providerAvailability: {
        mongo_enabled: true,
        postgre_enabled: false,
        mq_enabled: true,
      },
    } as ContextArgs;

    const assets = {
      mqChannelTag: envArgs.mqArgs
        ?.analyticsServerMessageQueueChannel as string,
      queueConsumer: new AnalyticsQueueConsumer(),
      applicationName: 'AnalyticsServer',
    } as MountAssets;

    var routes: Array<Route> = [];

    routes.push({ name: subRoutes.monitor, router: monitorRouter });
    routes.push({ name: subRoutes.event, router: eventRouter });

    const routeArgs = { routes } as RouteArgs;

    const args = {
      app,
      ctxArgs,
      routeArgs,
      assets,
    } as MountArgs;

    mountApp(args);
  };
}
