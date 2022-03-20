/**
 * @description holds event filter interface
 */

import { EventCategory } from '../enum/event-category.enum';

export interface EventFilter {
  name: string;
  category: EventCategory;
  start: number;
  end: number;
  skip: number;
  limit: number;
  reporter: string;
}
