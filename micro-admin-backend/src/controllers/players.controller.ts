// Dependencies
import { Controller, Logger } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

// Implementation
import { PlayerInterface } from '../interfaces'
import { PlayersService } from '../services'
import { ackMongodbErrors } from '../config'

// Ack massage helper
const ackErrorMessage = (error: Error, channel: any, identifier: any): void => {
  ackMongodbErrors.map(async ackError => {
    if (error.message.includes(ackError)) {
      await channel.ack(identifier)
    }
  })
}

@Controller()
export class PlayersController {
  // Class constructor
  constructor(private readonly playersService: PlayersService) {}

  // Nestjs console logger
  private logger = new Logger(PlayersController.name)

  // Message broker feature (microservices)
  @MessagePattern('add-player')
  async addPlayer(
    @Payload() player: PlayerInterface,
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Player: ${JSON.stringify(player)}`)

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      const returnPayload = await this.playersService.storePlayer(player)
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('update-player')
  async updateCategory(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Update Player data: ${JSON.stringify(data)}`)

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      const id: string = data.id
      const player: PlayerInterface = data.player
      const returnPayload = await this.playersService.updatePlayer(player, id)
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('get-players')
  async getCategories(
    @Payload() id: string,
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Player id: ${id}`)

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      const returnPayload = id
        ? await this.playersService.findPlayer(id)
        : await this.playersService.findPlayers()
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('delete-player')
  async deleteCategories(
    @Payload() id: string,
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Player id: ${id}`)

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      await this.playersService.deletePlayer(id)
      await channel.ack(defaultMessage)
      return { id }

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('check-player')
  async checkCategory(
    @Payload() id: string,
    @Ctx() context: RmqContext
  ) {

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Get player
      const returnPayload = await this.playersService.findPlayer(id)

      // Ack message and return
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }
}
