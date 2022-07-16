// Dependencies
import { Controller, Logger } from '@nestjs/common'
import { PlayersService } from '../services'

@Controller()
export class PlayersController {
  // Class constructor
  constructor(private readonly playersService: PlayersService) {}

  // Nestjs console logger
  private logger = new Logger(PlayersController.name)
}
