/**
 * @description holds event interface
 */

import { EventCategory } from '../enum/event-category.enum';

export interface Event {
  name: string;
  timestamp: number;
  payload: any;
  category: EventCategory;
  reporter: string;
}
