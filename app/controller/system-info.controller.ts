/**
 * @description holds system info controller
 */

import { Context } from '@open-template-hub/common';
import { Environment } from '../../environment';
import { SystemInfoRepository } from '../repository/system-info.repository';

export class SystemInfoController {

  environment;

  constructor() {
    this.environment = new Environment();
  }

  getNpmDownloads = async ( context: Context, key: any ) => {
    const systemInfoRepository = await new SystemInfoRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    return systemInfoRepository.getNpmDownloads( key );
  };
}
