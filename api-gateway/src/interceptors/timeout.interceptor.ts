// Dependencies
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { timeout } from 'rxjs/operators'
import { Observable } from 'rxjs'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // 10 seconds limit
    return next.handle().pipe(timeout(10000)) 
  }
}
