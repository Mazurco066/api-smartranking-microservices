// Dependencies
import { Body, Controller, Post, Get, Put, Logger, Query, Param, Delete } from '@nestjs/common'
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Observable } from 'rxjs'

// Implementations
import { AddCategoryDTO, UpdateCategoryDTO } from './dtos'
import { ValidateParamsPipe } from './pipes'

@Controller('api/v1')
export class AppController {
  // Class properties
  private logger = new Logger(AppController.name)
  private clientAdminBackend: ClientProxy

  // Class constructor
  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672/smartranking'],
        queue: 'admin-backend'
      }
    })
  }

  // Create categories following microservices event subscriber feature
  @Post('categories')
  addCategory(@Body() body: AddCategoryDTO): AddCategoryDTO {
    this.clientAdminBackend.emit('add-category', body)
    return body
  }

  @Put('categories/:id')
  updatedCategory(
    @Body() body: UpdateCategoryDTO,
    @Param('id', ValidateParamsPipe) _id: string
  ) {
    this.clientAdminBackend.emit('update-category', { id: _id, category: body })
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id', ValidateParamsPipe) _id: string) {
    this.clientAdminBackend.emit('delete-category', _id)
  }
  
  // Retrieve categories following microservices request/responder feature
  @Get('categories')
  findCategory(@Query('id') id: string): Observable<any> {
    return this.clientAdminBackend.send('get-categories', id ? id : '')
  }
}
