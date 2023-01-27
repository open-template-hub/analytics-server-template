#!/usr/bin/env bash

if [ ! -f .env ]; then
  echo "Generating .env file.."
  touch .env
  {
    echo "PORT=4005"

    echo "PROJECT=OTH"
    echo "MODULE=AnalyticsServer"
    echo "ENVIRONMENT=Local"

    echo "MONGODB_URI={Database Connection Url}"
    echo "MONGODB_CONNECTION_LIMIT={MongoDB Connection Limit}"

    echo "CLOUDAMQP_APIKEY={MQ Api Key}"
    echo "CLOUDAMQP_URL={MQ Connection Url}"

    echo "ANALYTICS_SERVER_QUEUE_CHANNEL=oth_analytics_queue"
    echo "ORCHESTRATION_SERVER_QUEUE_CHANNEL=oth_orchestration_queue"

    echo "REDISCLOUD_URL={Redis Connection Url}"
    echo "REDIS_CONNECTION_LIMIT={Redis Connection Limit}"

    echo "ACCESS_TOKEN_SECRET={Access Token Secret}"
    echo "RESPONSE_ENCRYPTION_SECRET={Response Encryption Secret}"

    echo "MAX_QUERY_LIMIT=100"

  } >>.env
else
  echo ".env file already exists. Nothing to do..."
fi
