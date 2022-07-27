  // Dependencies
import { Body, Controller, Post, Get, Put, Logger, Query, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom, Observable } from 'rxjs'

// Implementations
import { AddChallengeDTO } from './dtos'
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

  @Post()
  async addChallenge(@Body() body: AddChallengeDTO) {
    this.logger.log(`Add challenge: ${JSON.stringify(body)}`)

    // Retrieve ids
    const { category, players, requester } = body

    // Verify if requester exists
    const isRequesterRegistered = await firstValueFrom(this.clientAdminBackend.send('check-player', requester))
    if (!isRequesterRegistered) {
      throw new BadRequestException(`Jogador de id ${requester} não encontrado!`)
    }

    // Verify if both players are registered
    for (const player in players) {
      const isPlayerRegistered = await firstValueFrom(this.clientAdminBackend.send('check-player', players[player]))
      if (!isPlayerRegistered) {
        throw new BadRequestException(`Jogador de id ${player} não encontrado!`)
      }
    }

    // Validate if requester is a challenger
    const isRequesterChallenger = players.filter(p => p === requester).length > 0
    if (!isRequesterChallenger) {
      throw new BadRequestException(`O desafiante de id ${requester} não está entre os jogadores da partida.`)
    }

    // Validate if category exists
    const isCategoryRegistered = await firstValueFrom(this.clientAdminBackend.send('check-category-by-title', category))
    if (!isCategoryRegistered) {
      throw new BadRequestException(`O solicitante precisa estar dentro de uma categoria para iniciar um desafio.`)
    }

    // Add challenge
    const playerCategory = isCategoryRegistered
    return this.clientChallengeBackend.send('add-challenge', { challenge: body, category: playerCategory })
  }

}
