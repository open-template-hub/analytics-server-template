/**
 * @description holds event interface
 */


export interface Event {
  source: string;
  timestamp: number;
  category: string;
  reporter: string;
  payload: any;
}
