/**
 * @description holds event repository
 */

import { EventDataModel } from '../data/event.data';
import { Event } from '../interface/event.interface';

export class EventRepository {
  private dataModel: any = null;

  /**
   * initializes event repository
   * @param connection db connection
   */
  initialize = async ( connection: any ) => {
    this.dataModel = await new EventDataModel().getDataModel( connection );
    return this;
  };

  /**
   * creates event
   * @param event event
   * @returns created event
   */
  createEvent = async ( event: Event ) => {
    try {
      return await this.dataModel.create( event );
    } catch ( error ) {
      console.error( '> createEvent error: ', error );
      throw error;
    }
  };

  /**
   * gets filtered events
   * @param query query
   * @param limit limit
   * @returns filtered events
   */
  filterEvents = async ( query: any, skip: number, limit: number ) => {
    try {
      /*return await this.dataModel.find( query ).sort( { timestamp: -1 } )
      .skip(skip).limit( limit );*/

      let queryResult = await this.dataModel.aggregate([
        { $match: query },
        { $sort: { timestamp: -1 } },
        { $facet: {
          data: [
            { $match: { } },
            { $skip: skip },
            { $limit: limit }
          ],
          meta: [
            { $count: "count" },
            { $addFields: {
              skip: skip,
              limit: limit
            }}
          ]
        }}
      ]);

      if( queryResult.length > 0 ) {
        queryResult = queryResult[0];

        if( queryResult.meta.length > 0 ) {
          queryResult.meta = queryResult.meta[0]
        }

        return queryResult
      } 
      return { }
    } catch ( error ) {
      console.error( '> filterEvents error: ', error );
      throw error;
    }
  };
}
