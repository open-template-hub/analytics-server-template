/**
 * @description holds server main
 */
import dotenv from 'dotenv';
import cors from 'cors';
import { Routes } from './app/route/index.route';
import express from 'express';
import bodyParser from 'body-parser';
import { DebugLogUtil } from './app/util/debug-log.util';

const debugLogUtil = new DebugLogUtil();

// use .env file
const env = dotenv.config();
debugLogUtil.log(env.parsed);

// express init
const app: express.Application = express();

// public files
app.use(express.static('public'));

// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// mount routes
Routes.mount(app);

// listen port
const port: string = process.env.PORT || ('4005' as string);
app.listen(port, () => {
  console.info('Analytics Server is running on port: ', port);
});
