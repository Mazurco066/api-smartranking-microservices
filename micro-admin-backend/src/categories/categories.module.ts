// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Implementation
import { Category, CategorySchema } from './interfaces'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

// Modules
import { PlayersModule } from '../players/players.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    PlayersModule
  ],
  controllers: [ CategoriesController ],
  providers: [ CategoriesService ],
  exports: [ CategoriesService ]
})
export class CategoriesModule {}
