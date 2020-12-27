import { EventDataModel } from '../data/event.data';
import { EventFilter } from '../interface/event-filter.interface';
import { Event } from '../interface/event.interface';

export class EventRepository {
  private dataModel: any = null;

  initialize = async (connection: any) => {
    this.dataModel = await new EventDataModel().getDataModel(connection);
    return this;
  };

  createEvent = async (event: Event) => {
    try {
      return await this.dataModel.create(event);
    } catch (error) {
      console.error('> createEvent error: ', error);
      throw error;
    }
  };

  filterEvents = async (query: Event, limit: number) => {
    try {
      return await this.dataModel.find(query).limit(limit);
    } catch (error) {
      console.error('> filterEvents error: ', error);
      throw error;
    }
  };
}
