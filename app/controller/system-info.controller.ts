/**
 * @description holds system info controller
 */

import { Context } from '@open-template-hub/common';
import { Environment } from '../../environment';
import { SystemInfoRepository } from '../repository/system-info.repository';
import axios from 'axios';

export class SystemInfoController {

  environment;

  constructor() {
    this.environment = new Environment();
  }

  getSystemInfo = async ( context: Context, key: any ) => {
    const systemInfoRepository = await new SystemInfoRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    return systemInfoRepository.getSystemInfo( key );
  };

  updateSystemInfo = async ( context: Context, key: any ) => {
    const systemInfoRepository = await new SystemInfoRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    if ( key === 'npm-downloads' ) {
      const count = await this.getNpmPackagesDownloadCount();
      return systemInfoRepository.incrementSystemInfo( key, count );
    }
  };

  getNpmPackagesDownloadCount = async () => {
    const today = new Date();

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate( today.getDate() - 2 );

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate( today.getDate() - 3 );

    let count = 0;

    for ( const npmPackage of this.NPM_PACKAGES ) {
      const url = `https://api.npmjs.org/downloads/point/${ this.formatDate( threeDaysAgo ) }:${ this.formatDate( twoDaysAgo ) }/@open-template-hub/${ npmPackage }`;
      console.info( url );

      const response = await axios.get<any>( url );
      count += response.data.downloads;
    }

    return count;
  };

  formatDate = ( date: Date ) => {
    const year = date.getFullYear();
    let month = '' + ( date.getMonth() + 1 );
    let day = '' + date.getDate();

    if ( month.length < 2 ) {
      month = '0' + month;
    }

    if ( day.length < 2 ) {
      day = '0' + day;
    }

    return [ year, month, day ].join( '-' );
  };

  NPM_PACKAGES: string[] = [
    'server-generator', 'app-generator', 'animated-code-editor', 'led', 'card', 'button', 'hero', 'ui-library-template', 'common'
  ];
}
