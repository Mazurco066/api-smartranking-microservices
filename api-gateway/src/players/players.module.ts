// Dependencies
import { Module } from '@nestjs/common'
import { PlayersController } from './players.controller'

@Module({
  imports: [],
  controllers: [ PlayersController ],
  providers: []
})
export class PlayersModule {}