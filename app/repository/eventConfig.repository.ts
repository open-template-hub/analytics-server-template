import { EventConfigDataModel } from "../data/eventConfig.data";

export class EventConfigRepository {
    private dataModel: any = null;

    /**
     * initializes eventConfig repository
     * @param connection db connection
     */
    initialize = async ( connection: any ) => {
      this.dataModel = await new EventConfigDataModel().getDataModel( connection );
      return this;
    };
  
    getConfig = async ( key: string ) => {
      try {
        return await this.dataModel.findOne( { key } );
      } catch ( error ) {
        console.error( '> getConfig error: ', error );
        throw error;
      }
    };
}