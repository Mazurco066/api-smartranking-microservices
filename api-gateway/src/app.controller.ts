// Dependencies
import { Body, Controller, Post, Put, Logger, Param } from '@nestjs/common'
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'

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

  @Post('categories')
  addCategory(@Body() body: AddCategoryDTO) {
    return this.clientAdminBackend.emit('add-category', body)
  }
  
  @Put('categories/:id')
  async updateCategory(
    @Param('id', ValidateParamsPipe) id: string,
    @Body() body: UpdateCategoryDTO
  ) {
    return this.clientAdminBackend.emit('update-category', body)
  }
}
