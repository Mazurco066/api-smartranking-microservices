// Dependencies
import { Body, Controller, Post, Get, Put, Logger, Query, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom, Observable } from 'rxjs'

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
  async findCategory(@Query('id') id: string): Promise<Observable<any>> {
    this.logger.log(`Find Categories: ${id}`)

    // Verify if register exists
    if (id) {
      const isRegistered = await firstValueFrom(this.clientAdminBackend.send('check-category', id))
      if (!isRegistered) {
        throw new NotFoundException(`Categoria de id ${id} não encontrada!`)
      }
    }

    return this.clientAdminBackend.send('get-categories', id ? id : '')
  }

  @Delete('/:id')
  async deleteCategory(@Param('id', ValidateParamsPipe) _id: string) {
    this.logger.log(`Delete Category: ${_id}`)

    // Verify if register exists
    if (_id) {
      const isRegistered = await firstValueFrom(this.clientAdminBackend.send('check-category', _id))
      if (!isRegistered) {
        throw new BadRequestException(`Categoria de id ${_id} não encontrada!`)
      }
    }

    return this.clientAdminBackend.send('delete-category', _id)
  }

  @Put('/:id')
  async updatedCategory(
    @Body() body: UpdateCategoryDTO,
    @Param('id', ValidateParamsPipe) _id: string
  ) {
    this.logger.log(`Update Category: ${JSON.stringify(body)}`)

    // Verify if register exists
    if (_id) {
      const isRegistered = await firstValueFrom(this.clientAdminBackend.send('check-category', _id))
      if (!isRegistered) {
        throw new BadRequestException(`Categoria de id ${_id} não encontrada!`)
      }
    }

    return this.clientAdminBackend.send('update-category', { id: _id, category: body })
  }
}
