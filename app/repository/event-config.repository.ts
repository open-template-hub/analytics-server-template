import { UserRole } from '@open-template-hub/common';
import { EventConfigDataModel } from '../data/event-config.data';

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

  getCategories = async ( userRole: UserRole, language: string, defaultLanguage: string ) => {
    try {
      let dataModel = await this.dataModel.aggregate( [
        { $match: { roles: { $in: [ userRole ] } } },
        {
          $project: {
            key: 1,
            messages: {
              $filter: {
                input: '$messages',
                as: 'item',
                cond: {
                  $or: [
                    { $eq: [ '$$item.language', language ] },
                    { $eq: [ '$$item.language', defaultLanguage ] }
                  ]
                }
              }
            }
          }
        }
      ] );

      for ( const element of dataModel ) {
        let newMessagesArray: string[] = [];
        if ( element.messages?.length > 1 ) {
          for ( let message of element.messages ) {
            if ( message.language === language ) {
              newMessagesArray.push( message );
            }
          }

          if ( newMessagesArray.length > 0 ) {
            element.messages = newMessagesArray;
          }
        }
      }

      return dataModel;

    } catch ( error ) {
      console.error( '> getCategories error: ', error );
      throw error;
    }
  };
}
