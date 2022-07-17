// Dependencies
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { tap } from 'rxjs/operators'
import { Observable } from 'rxjs'

export class LoggingInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // Retrieve request start moment
    console.log('Request received...')
    const now = Date.now()
    
    // Calculate request time in miliseconds
    return next.handle().pipe(
      tap(() => console.log(`Response Time: ${Date.now() - now}ms`))
    )
  }
}
