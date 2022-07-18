  // Dependencies
import { Body, Controller, Post, Get, Put, Logger, Query, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom, Observable } from 'rxjs'

// Implementations
import { proxyClientAdmin, proxyClientChallenges } from '../common/helpers'

@Controller('api/v1/challenges')
export class ChallengesController {
  // Class properties
  private logger = new Logger(ChallengesController.name)
  private clientAdminBackend: ClientProxy
  private clientChallengeBackend: ClientProxy

  // Class constructor (Retrieve rabbitmq proxy connection)
  constructor() {
    this.clientAdminBackend = proxyClientAdmin
    this.clientChallengeBackend = proxyClientChallenges
  }

}
