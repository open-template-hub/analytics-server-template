/**
 * @description holds event interface
 */


export interface Event {
  source: string;
  timestamp: number;
  payload: any;
  category: string;
  reporter: string;
}
