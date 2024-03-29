// Dependencies
import { Controller, Logger } from '@nestjs/common'
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

// Implementation
import { CategoryInterface } from './interfaces'
import { CategoriesService } from './categories.service'
import { ackMongodbErrors } from '../common/config'

// Ack massage helper
const ackErrorMessage = (error: Error, channel: any, identifier: any): void => {
  ackMongodbErrors.map(async ackError => {
    if (error.message.includes(ackError)) {
      await channel.ack(identifier)
    }
  })
}

@Controller()
export class CategoriesController {
  // Class constructor
  constructor(private readonly categoriesService: CategoriesService) {}

  // Nestjs console logger
  private logger = new Logger(CategoriesController.name)

  // Event subscriber feature (microservices)
  @EventPattern('add-category')
  async addCategory(
    @Payload() category: CategoryInterface,
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Category: ${JSON.stringify(category)}`)

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      await this.categoriesService.storeCategory(category)
      await channel.ack(defaultMessage)

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  // Message broker feature (microservices)
  @MessagePattern('update-category')
  async updateCategory(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Update Category data: ${JSON.stringify(data)}`)

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      const id: string = data.id
      const category: CategoryInterface = data.category
      const returnPayload = await this.categoriesService.updateCategory(category, id)
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('get-categories')
  async getCategories(
    @Payload() id: string,
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Category id: ${id}`)

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      const returnPayload = id
        ? await this.categoriesService.findCategory(id)
        : await this.categoriesService.findCategories()
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('delete-category')
  async deleteCategories(
    @Payload() id: string,
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Category id: ${id}`)

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      await this.categoriesService.deleteCategory(id)
      await channel.ack(defaultMessage)
      return { id }

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('check-category')
  async checkCategory(
    @Payload() id: string,
    @Ctx() context: RmqContext
  ) {

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Get category
      const returnPayload = await this.categoriesService.findCategory(id)

      // Ack message and return
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('check-category-by-title')
  async checkCategoryByTitle(
    @Payload() title: string,
    @Ctx() context: RmqContext
  ) {

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Get category
      const returnPayload = await this.categoriesService.findCategoryByTitle(title)

      // Ack message and return
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }
}
