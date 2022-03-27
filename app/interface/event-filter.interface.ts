/**
 * @description holds event filter interface
 */

export interface EventFilter {
  name: string;
  category: string;
  start: number;
  end: number;
  skip: number;
  limit: number;
  reporter: string;
}
