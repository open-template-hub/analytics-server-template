import { DbArgs, EnvArgs, MqArgs, TokenArgs } from '@open-template-hub/common';

export class Environment {
  constructor(private _args: EnvArgs = {} as EnvArgs) {
    const tokenArgs = {
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
      responseEncryptionSecret: process.env.RESPONSE_ENCRYPTION_SECRET,
    } as TokenArgs;

    const dbArgs = {
      mongoDbConnectionLimit: process.env.MONGODB_CONNECTION_LIMIT,
      mongoDbUri: process.env.MONGODB_URI,
      redisUri: process.env.REDISCLOUD_URL,
      redisConnectionLimit: process.env.REDIS_CONNECTION_LIMIT,
    } as DbArgs;

    const mqArgs = {
      messageQueueConnectionUrl: process.env.CLOUDAMQP_URL,
      analyticsServerMessageQueueChannel:
        process.env.ANALYTICS_SERVER_QUEUE_CHANNEL,
      orchestrationServerMessageQueueChannel:
        process.env.ORCHESTRATION_SERVER_QUEUE_CHANNEL,
    } as MqArgs;

    const serverSpecificArgs = {
      maxQueryLimit: process.env.MAX_QUERY_LIMIT,
    } as any;

    this._args = { tokenArgs, dbArgs, mqArgs, serverSpecificArgs } as EnvArgs;
  }

  args = () => {
    return this._args;
  };
}
