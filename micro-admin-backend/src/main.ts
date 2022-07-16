// Dependencies
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'

// Implementations
import { AppModule } from './app.module'

// Nestjs console logger
const logger = new Logger('Main')

async function bootstrap() {
  // Configure this module as a micro service
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672/smartranking'],
      queue: 'admin-backend'
    }
  })

  // Bind to a port
  logger.log('Microservice is listening')
  await app.listen()
}

// Starting module
bootstrap()
