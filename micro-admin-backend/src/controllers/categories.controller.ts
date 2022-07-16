// Dependencies
import { Controller, Logger } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { CategoryInterface } from '../interfaces'
import { CategoriesService } from '../services'

@Controller()
export class CategoriesController {
  // Class constructor
  constructor(private readonly categoriesService: CategoriesService) {}

  // Nestjs console logger
  private logger = new Logger(CategoriesController.name)

  // Event subscriber method (microservices)
  @EventPattern('add-category')
  async addCategory(
    @Payload() category: CategoryInterface
  ) {
    this.logger.log(`Category: ${JSON.stringify(category)}`)
    return await this.categoriesService.storeCategory(category)
  }

  // Message broker method (microservices)
  @MessagePattern('get-categories')
  async getCategories(
    @Payload() id: string
  ) {
    this.logger.log(`Category id: ${id}`)
    return id
      ? await this.categoriesService.findCategory(id)
      : await this.categoriesService.findCategories()
  }
}
