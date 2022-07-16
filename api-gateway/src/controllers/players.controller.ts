// Dependencies
import { Body, Controller, Post, Get, Put, Logger, Query, Param, Delete } from '@nestjs/common'
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Observable } from 'rxjs'

// Implementations
import { AddPlayerDTO, UpdatePlayerDTO } from '../dtos'
import { ValidateParamsPipe } from '../pipes'

@Controller('api/v1/players')
export class PlayersController {
  // Class properties
  private logger = new Logger(PlayersController.name)
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

  @Post()
  addPlayer(@Body() body: AddPlayerDTO) {
    this.logger.log(`Add Player: ${JSON.stringify(body)}`)
    return this.clientAdminBackend.send('add-player', body)
  }  

  @Get()
  findPlayer(@Query('id') id: string): Observable<any> {
    this.logger.log(`Get Players: ${id}`)
    return this.clientAdminBackend.send('get-players', id ? id : '')
  }

  @Delete('/:id')
  deletePlayer(@Param('id', ValidateParamsPipe) _id: string) {
    this.logger.log(`Delete Player: ${_id}`)
    return this.clientAdminBackend.send('delete-player', _id)
  }

  @Put('/:id')
  updatedPlayer(
    @Body() body: UpdatePlayerDTO,
    @Param('id', ValidateParamsPipe) _id: string
  ) {
    this.logger.log(`Update Player: ${JSON.stringify(body)}`)
    return this.clientAdminBackend.send('update-player', { id: _id, player: body })
  }
}
