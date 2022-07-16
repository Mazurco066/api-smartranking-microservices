// Dependencies
import { Body, Controller, Post, Get, Put, Logger, Query, Param, Delete } from '@nestjs/common'
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Observable } from 'rxjs'

// Implementations
import { AddCategoryDTO, UpdateCategoryDTO } from '../dtos'
import { ValidateParamsPipe } from '../pipes'

@Controller('api/v1/categories')
export class CategoriesController {
  // Class properties
  private logger = new Logger(CategoriesController.name)
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
  @Post()
  addCategory(@Body() body: AddCategoryDTO): AddCategoryDTO {
    this.clientAdminBackend.emit('add-category', body)
    return body
  }  
  
  // Retrieve categories following microservices request/responder feature
  @Get()
  findCategory(@Query('id') id: string): Observable<any> {
    return this.clientAdminBackend.send('get-categories', id ? id : '')
  }

  @Delete('/:id')
  deleteCategory(@Param('id', ValidateParamsPipe) _id: string) {
    return this.clientAdminBackend.send('delete-category', _id)
  }

  @Put('/:id')
  updatedCategory(
    @Body() body: UpdateCategoryDTO,
    @Param('id', ValidateParamsPipe) _id: string
  ) {
    return this.clientAdminBackend.send('update-category', { id: _id, category: body })
  }
}