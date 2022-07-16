// Dependencies
import { Module } from '@nestjs/common'
import { CategoriesController, PlayersController } from './controllers'

@Module({
  imports: [],
  controllers: [ CategoriesController, PlayersController ],
  providers: []
})
export class AppModule {}
