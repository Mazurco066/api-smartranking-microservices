// Dependencies
import { Controller, Logger } from '@nestjs/common'

// Implementation
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
}
