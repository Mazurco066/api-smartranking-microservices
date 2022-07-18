// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Implementation
import { databaseURI } from './common/config'

// Modules
import { CategoriesModule } from './categories/categories.module'
import { PlayersModule } from './players/players.module'

@Module({
  imports: [
    MongooseModule.forRoot(databaseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'SmartRankingAdmin'
    }),
    CategoriesModule,
    PlayersModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
