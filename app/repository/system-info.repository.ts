/**
 * @description holds event repository
 */

import { SystemInfoDataModel } from '../data/system-info.data';

export class SystemInfoRepository {

  private dataModel: any = null;

  initialize = async ( connection: any ) => {
    this.dataModel = await new SystemInfoDataModel().getDataModel( connection );
    return this;
  };

  getNpmDownloads = async ( key: any ) => {
    try {
      return await this.dataModel.findOne( { key } );
    } catch ( error ) {
      console.error( '> getNpmDownloads error: ', error );
      throw error;
    }
  };
}
