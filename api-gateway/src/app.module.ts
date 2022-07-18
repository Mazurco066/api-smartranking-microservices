// Dependencies
import { Module } from '@nestjs/common'

// Modules
import { CategoriesModule } from './categories/categories.module'
import { ChallengesModule } from './challenges/challenges.module'
import { PlayersModule } from './players/players.module'

@Module({
  imports: [ CategoriesModule, ChallengesModule, PlayersModule ],
  controllers: [],
  providers: []
})
export class AppModule {}
