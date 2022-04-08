import { UserRole } from "@open-template-hub/common";
import { EventConfigDataModel } from "../data/event-config.data";

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

    getCategory = async ( key: string )  => {
      try {
        return await this.dataModel.findOne( key );
      } catch(error) {
        console.error( '> getCategory error: ', error );
        throw error;
      }
    }
  
    getCategories = async ( userRole: UserRole, language: string, defaultLanguage: string ) => {
      try {
        let dataModel = await this.dataModel.aggregate( [ 
          { $match: { roles: { $in: [userRole] } } },
          { $project: { 
            key: 1,
            messages: {
              $filter: {
                input: "$messages",
                as: "item",
                cond: {
                  $or: [ 
                    { $eq: [ "$$item.language", language ] }, 
                    { $eq: ["$$item.language", defaultLanguage ] }
                  ] }
              }
            } 
          } }
        ] );

        let newMessagesArray: string[] = [];
        for(let i = 0; i < dataModel.length; i++) {
          if( dataModel[i].messages?.length > 1 ) {
            for(let j = 0; j < dataModel[i].messages.length; j++ ) {
              if( dataModel[i].messages[j].language === language ) {
                newMessagesArray.push( dataModel[i].messages[j] );
              }
            }
    
            if( newMessagesArray.length > 0 ) {
              dataModel[i].messages = newMessagesArray;
            }
          }
        }
  
        return dataModel

      } catch ( error ) {
        console.error( '> getCategories error: ', error );
        throw error;
      }
    };
}