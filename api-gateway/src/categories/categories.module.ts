// Dependencies
import { Module } from '@nestjs/common'
import { CategoriesController } from './categories.controller'

@Module({
  imports: [],
  controllers: [ CategoriesController ],
  providers: []
})
export class CategoriesModule {}
