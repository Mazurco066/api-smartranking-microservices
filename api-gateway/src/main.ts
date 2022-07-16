// Dependencies
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as momentTimezone from 'moment-timezone'

// Server implementation dependencies
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './filters'
import { LoggingInterceptor, TimeoutInterceptor } from './interceptors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // DTO Configuration
  const validationOptions = {
    skipMissingProperties: false,
    validationError: { target: false },
    validateCustomDecorators: true
  }

  // Pipes, filters and prefixes
  app.useGlobalPipes(new ValidationPipe(validationOptions))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor()
  )

  // Date default format
  Date.prototype.toJSON = function() : any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS')
  }

  // Assign server port
  await app.listen(3001)
}

// Starting api-gateway
bootstrap()
