// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Implementation
import { AppController } from './app.controller'
import { AppService } from './app.service'
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
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule {}
