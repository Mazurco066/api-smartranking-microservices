// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Implementation
import { databaseURI } from './common/config'

// Modules
import { ChallengesModule } from './challenges/challenges.module'

@Module({
  imports: [
    MongooseModule.forRoot(databaseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'SmartRankingChallenges'
    }),
    ChallengesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
