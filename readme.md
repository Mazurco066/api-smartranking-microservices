# Smartranking API

This is a sample project testing microservices using [NestJs](https://nestjs.com) and [RabbitMQ](https://www.rabbitmq.com)

## Setup

Assuming you have [yarn](https://yarnpkg.com/), run the following commands to install dependencies and run the App:

```sh
# Start RabbitMQ service on localhost
docker-compose up --build -d

# Install dependendencies and start api-gateway
cd api-gateway
yarn install
yarn start:dev

# Install dependendencies and start micro-admin-backend
cd micro-admin-backend
yarn install
yarn start:dev
```
Obs: Dont forget to copy the content of .env.example file to a new .env file before starting