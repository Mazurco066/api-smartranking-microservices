// Dependencies
import { Module } from '@nestjs/common'
import { PlayersController } from './players.controller'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'

@Module({
  imports: [ CloudinaryModule ],
  controllers: [ PlayersController ],
  providers: []
})
export class PlayersModule {}