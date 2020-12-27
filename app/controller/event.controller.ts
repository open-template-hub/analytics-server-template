import { Context } from '../interface/context.interface';
import { EventRepository } from '../repository/event.repository';
import { Event } from '../interface/event.interface';
import { EventCategory } from '../enum/event-category.enum';
import { EventFilter } from '../interface/event-filter.interface';

export class EventController {
  /**
   * creates event
   * @param context context
   * @param event event
   * @returns created event
   */
  createEvent = async (context: Context, event: Event) => {
    const eventRepository = await new EventRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    if (!event.category) {
      event.category = EventCategory.DEFAULT;
    }

    event.reporter = context.username;

    return await eventRepository.createEvent(event);
  };

  /**
   * filters events
   * @param context context
   * @param filter filter
   * @returns filtered events
   */
  filterEvents = async (context: Context, filter: EventFilter) => {
    const eventRepository = await new EventRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    const query = this.getQueryFromFilter(filter);

    return await eventRepository.filterEvents(query, filter.limit);
  };

  /**
   * creates query from the filter
   * @param filter filter
   * @returns query
   */
  getQueryFromFilter = (filter: EventFilter) => {
    var query = {} as any;

    if (filter.name) {
      query.name = { $eq: filter.name };
    }

    if (filter.category) {
      query.category = { $eq: filter.category };
    }

    if (filter.reporter) {
      query.reporter = { $eq: filter.reporter };
    }

    if (filter.start) {
      query.timestamp = { $gte: filter.start };
    }

    if (filter.end) {
      query.timestamp = { $lte: filter.end };
    }

    return query;
  };
}
