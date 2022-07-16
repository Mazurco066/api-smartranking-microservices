// Dependencies
import { Injectable, Logger } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Player, PlayerDocument, PlayerInterface } from '../interfaces'

// Service 
@Injectable()
export class PlayersService {

  // Dependency injection
  constructor(
    @InjectModel(Player.name) private playerSchema: Model<PlayerDocument>
  ) {}

  // Service logger
  private readonly logger = new Logger(PlayersService.name)

  // Public methods
  async storePlayer(body: PlayerInterface): Promise<Player> {
    this.logger.log(`storePlayer - params: ${JSON.stringify(body)}`)
    const player = await this.store(body)
    return player
  }

  async updatePlayer(body: PlayerInterface, id: string): Promise<Player> {
    this.logger.log(`updatePlayer - params: ${JSON.stringify(body)}`)
    const player = await this.update(body, id)
    return player
  }

  async findPlayer(id: string): Promise<Player> {
    const player = await this.searchPlayer(id)
    if (!player) {
      throw new RpcException(`[E404] Jogador de id ${id} não encontrado!`)
    }

    return player
  }

  async findPlayers(): Promise<Player[]> {
    return await this.listPlayers()
  }

  async deletePlayer(id: string): Promise<void> {
    await this.delete(id)
  }

  // Persist methods
  private async store(data: PlayerInterface): Promise<Player> {
    try {

      const r = await this.playerSchema.create({
        ...data,
        ranking: 'A',
        position: 5,
        avatar: 'https://ik.imagekit.io/vlu8c10nqkd/default-image.jpg'
      })
      return r
      
    } catch(e) {
      this.logger.error(`Error: ${JSON.stringify(e.message)}`)
      throw new RpcException(e.message)
    }
  }

  private async update(data: PlayerInterface, id: string): Promise<Player> {
    try {

      const r = await this.playerSchema.findByIdAndUpdate(id, {
        $set: {
          ...data
        }
      }, { new: true })
      return r
      
    } catch(e) {
      this.logger.error(`Error: ${JSON.stringify(e.message)}`)
      throw new RpcException(e.message)
    }
  }

  private async searchPlayer(id: string): Promise<Player> {
    return await this.playerSchema.findOne({ _id: id })
  }

  private async listPlayers(): Promise<Player[]> {
    const r = await this.playerSchema.find()
    return r
  }

  private async delete(id: string): Promise<boolean> {
    try {
      const foundPlayer = await this.playerSchema.findOne({ _id:  id })
      if (!foundPlayer) throw new RpcException('Player not found')
      const r = await this.playerSchema.deleteOne({ _id: id })
      return r.deletedCount ? true : false

    } catch(e) {
      this.logger.error(`Error: ${JSON.stringify(e.message)}`)
      throw new RpcException(e.message)
    }
  }
}
