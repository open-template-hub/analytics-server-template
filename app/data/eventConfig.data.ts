/**
 * @description holds event model
 */

 import mongoose from 'mongoose';

 export class EventConfigDataModel {
   private readonly collectionName: string = 'event_config';
   private dataSchema: mongoose.Schema;
 
   constructor() {
     /**
      * Provider schema
      */
     const schema: mongoose.SchemaDefinition = {
       key: { type: String, required: true },
       categories: { type: Array, default: [] },
       limit: { type: Number, required: true }
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
 