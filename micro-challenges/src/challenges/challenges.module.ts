// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Implementation
import { Challenge, ChallengeSchema, Match, MatchSchema } from './interfaces'
import { ChallengesController } from './challenges.controller'
import { ChallengesService } from './challenges.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Match.name, schema: MatchSchema }
    ])
  ],
  controllers: [ ChallengesController ],
  providers: [ ChallengesService ],
  exports: [ ChallengesService ]
})
export class ChallengesModule {}
