// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Implementation
import { Player, PlayerSchema } from './interfaces'
import { PlayersController } from './players.controller'
import { PlayersService } from './players.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
    ])
  ],
  controllers: [ PlayersController ],
  providers: [ PlayersService ],
  exports: [ PlayersService ]
})
export class PlayersModule {}
