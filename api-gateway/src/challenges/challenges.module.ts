// Dependencies
import { Module } from '@nestjs/common'
import { ChallengesController } from './challenges.controller'

@Module({
  imports: [],
  controllers: [ ChallengesController ],
  providers: []
})
export class ChallengesModule {}
