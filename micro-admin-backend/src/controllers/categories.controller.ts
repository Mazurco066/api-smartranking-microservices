// Dependencies
import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { CategoryInterface } from '../interfaces'
import { CategoriesService } from '../services'

@Controller()
export class CategoriesController {
  // Class constructor
  constructor(private readonly categoriesService: CategoriesService) {}

  // Nestjs console logger
  private logger = new Logger(CategoriesController.name)

  @EventPattern('add-category')
  async addCategory(
    @Payload() category: CategoryInterface
  ) {
    this.logger.log(`Category: ${JSON.stringify(category)}`)
    return await this.categoriesService.storeCategory(category)
  }
}
