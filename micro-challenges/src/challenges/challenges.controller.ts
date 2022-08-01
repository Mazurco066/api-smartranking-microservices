// Dependencies
import { Controller, Logger } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

// Implementation
import { ChallengesService } from './challenges.service'
import { ackMongodbErrors } from '../common/config'
import { ChallengeInterface } from './interfaces'

// Ack massage helper
const ackErrorMessage = (error: Error, channel: any, identifier: any): void => {
  ackMongodbErrors.map(async ackError => {
    if (error.message.includes(ackError)) {
      await channel.ack(identifier)
    }
  })
}

@Controller()
export class ChallengesController {
  // Class constructor
  constructor(private readonly challengesService: ChallengesService) {}

  // Nestjs console logger
  private logger = new Logger(ChallengesController.name)

  // Message broker feature (microservices)
  @MessagePattern('add-challenge')
  async addChallenge(
    @Payload() data: { challenge: ChallengeInterface, category: any },
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Challenge: ${JSON.stringify(data)}`)

    // Destruct params
    const { challenge, category } = data

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      const returnPayload = await this.challengesService.storeChallenge(challenge, category)
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('update-challenge')
  async updateChallenge(
    @Payload() data: { id: string, challenge: ChallengeInterface },
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Challenge: ${JSON.stringify(data)}`)

    // Destruct params
    const { id, challenge } = data

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Persist and ack message
      const returnPayload = await this.challengesService.updateChallenge(challenge, id)
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
  }

  @MessagePattern('check-challenge')
  async checkChallenge(
    @Payload() id: string,
    @Ctx() context: RmqContext
  ) {

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Get player
      const returnPayload = await this.challengesService.findChallenge(id)

      // Ack message and return
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }

  }

  @MessagePattern('get-challenge')
  async findChallenge(
    @Payload() data: { id?: string, playerId?: string },
    @Ctx() context: RmqContext
  ) {
    this.logger.log(`Find challenge: ${JSON.stringify(data)}`)

    // Retrieve original message and nestjs channel
    const channel = context.getChannelRef()
    const defaultMessage = context.getMessage()

    try {

      // Retrieve params
      const { id, playerId } = data
      const returnPayload = id
        ? await this.challengesService.findById(id)
        : await this.challengesService.findAllChallenges(playerId)
      await channel.ack(defaultMessage)
      return returnPayload

    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`)
      ackErrorMessage(error, channel, defaultMessage)
    }
    
  }
}
