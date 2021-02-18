/**
 * @description holds event model
 */

import mongoose from 'mongoose';

export class EventDataModel {
  private readonly collectionName: string = 'event';
  private dataSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      name: { type: String, required: true },
      reporter: { type: String, required: true },
      category: { type: String, required: true },
      timestamp: { type: Number, required: true },
      payload: { type: Object },
    };
    this.dataSchema = new mongoose.Schema( schema );
  }

  /**
   * creates provider model
   * @returns provider model
   */
  getDataModel = async ( conn: mongoose.Connection ) => {
    return conn.model(
        this.collectionName,
        this.dataSchema,
        this.collectionName
    );
  };
}
