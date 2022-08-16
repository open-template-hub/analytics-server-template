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

  getSystemInfo = async ( key: any ) => {
    try {
      return await this.dataModel.findOne( { key } );
    } catch ( error ) {
      console.error( '> getSystemInfo error: ', error );
      throw error;
    }
  };

  updateSystemInfo = async ( key: any, value: any ) => {
    try {
      return await this.dataModel.findOneAndUpdate( { key }, { value } );
    } catch ( error ) {
      console.error( '> updateSystemInfo error: ', error );
      throw error;
    }
  };

  incrementSystemInfo = async ( key: any, incrementBy: any ) => {
    try {
      return await this.dataModel.findOneAndUpdate( { key }, { $inc: { value: incrementBy } } );
    } catch ( error ) {
      console.error( '> incrementSystemInfo error: ', error );
      throw error;
    }
  };
}
