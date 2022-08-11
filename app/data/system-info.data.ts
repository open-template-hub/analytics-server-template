/**
 * @description holds event model
 */

import mongoose from 'mongoose';

export class SystemInfoDataModel {
  private readonly collectionName: string = 'system_info';
  private dataSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      key: { type: String, required: true },
      value: { type: Object, required: true },
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
