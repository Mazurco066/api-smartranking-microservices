// Dependencies
import { Controller, Logger } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

// Implementation
import { ChallengesService } from './challenges.service'
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
export class ChallengesController {
  // Class constructor
  constructor(private readonly challengesService: ChallengesService) {}

  // Nestjs console logger
  private logger = new Logger(ChallengesController.name)

  // Message broker feature (microservices)
  @MessagePattern('add-challenge')
  async addPlayer(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    // Logging event
    this.logger.log(`Player: ${JSON.stringify(data)}`)

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
}
