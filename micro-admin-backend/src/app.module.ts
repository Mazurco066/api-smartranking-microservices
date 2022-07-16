// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Implementation
import { CategoriesController, PlayersController } from './controllers'
import { CategoriesService, PlayersService } from './services'
import { databaseURI } from './config'
import { Category, CategorySchema, Player, PlayerSchema } from './interfaces'

@Module({
  imports: [
    MongooseModule.forRoot(databaseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'SmartRankingAdmin'
    }),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Player.name, schema: PlayerSchema }
    ])
  ],
  controllers: [ CategoriesController, PlayersController ],
  providers: [ CategoriesService, PlayersService ]
})
export class AppModule {}
