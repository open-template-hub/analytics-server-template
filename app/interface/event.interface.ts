/**
 * @description holds event interface
 */

import { EventCategory } from '../enum/event-category.enum';

export interface Event {
  source: string;
  timestamp: number;
  payload: any;
  category: string;
  reporter: string;
}
