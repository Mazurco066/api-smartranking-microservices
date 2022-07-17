// Dependencies
import { Body, Controller, Post, Get, Put, Logger, Query, Param, Delete } from '@nestjs/common'
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Observable } from 'rxjs'

// Implementations
import { AddCategoryDTO, UpdateCategoryDTO } from './dtos'
import { ValidateParamsPipe } from '../common/pipes'
import { proxyClient } from '../common/helpers'

@Controller('api/v1/categories')
export class CategoriesController {
  // Class properties
  private logger = new Logger(CategoriesController.name)
  private clientAdminBackend: ClientProxy

  // Class constructor (Retrieve rabbitmq proxy connection)
  constructor() {
    this.clientAdminBackend = proxyClient
  }

  // Create categories following microservices event subscriber feature
  @Post()
  addCategory(@Body() body: AddCategoryDTO): AddCategoryDTO {
    this.logger.log(`Add Category: ${JSON.stringify(body)}`)
    this.clientAdminBackend.emit('add-category', body)
    return body
  }  
  
  // Retrieve categories following microservices request/responder feature
  @Get()
  findCategory(@Query('id') id: string): Observable<any> {
    this.logger.log(`Find Categories: ${id}`)
    return this.clientAdminBackend.send('get-categories', id ? id : '')
  }

  @Delete('/:id')
  deleteCategory(@Param('id', ValidateParamsPipe) _id: string) {
    this.logger.log(`Delete Category: ${_id}`)
    return this.clientAdminBackend.send('delete-category', _id)
  }

  @Put('/:id')
  updatedCategory(
    @Body() body: UpdateCategoryDTO,
    @Param('id', ValidateParamsPipe) _id: string
  ) {
    this.logger.log(`Update Category: ${JSON.stringify(body)}`)
    return this.clientAdminBackend.send('update-category', { id: _id, category: body })
  }
}
