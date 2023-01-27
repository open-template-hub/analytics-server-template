import {
  ContextArgs,
  mount as mountApp,
  MountArgs,
  MountAssets,
  Route,
  RouteArgs,
} from '@open-template-hub/common';
import { Environment } from '../../environment';
import { AnalyticsQueueConsumer } from '../consumer/analytics-queue.consumer';
import { router as eventRouter } from './event.route';
import { router as monitorRouter } from './monitor.route';
import { router as systemInfoRouter } from './system-info.route';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  event: '/event',
  systemInfo: '/system-info',
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
        redis_enabled: false,
      },
    } as ContextArgs;

    const assets = {
      mqChannelTag: envArgs.mqArgs
        ?.analyticsServerMessageQueueChannel as string,
      queueConsumer: new AnalyticsQueueConsumer(),
      applicationName: 'AnalyticsServer',
    } as MountAssets;

    const routes: Array<Route> = [];

    routes.push({ name: subRoutes.monitor, router: monitorRouter });
    routes.push({ name: subRoutes.event, router: eventRouter });
    routes.push({ name: subRoutes.systemInfo, router: systemInfoRouter });

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
