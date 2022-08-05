// Dependencies
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError, ObjectId } from 'mongodb'

// Implementations
import { ChallengeInterface } from './interfaces'
import { Challenge, ChallengeDocument, Match, MatchDocument } from './interfaces'
import { ChallengeStatus } from './enums'

// Service 
@Injectable()
export class ChallengesService {

  // Dependency injection
  constructor(
    @InjectModel(Challenge.name) private challengeSchema: Model<ChallengeDocument>,
    @InjectModel(Match.name) private matchSchema: Model<MatchDocument>
  ) {}

  // Service logger
  private readonly logger = new Logger(ChallengesService.name)

  // Public methods
  async storeChallenge(body: ChallengeInterface, category: any): Promise<Challenge> {
    this.logger.log(`storeChallenge - params: ${JSON.stringify(body)}`)

    // Creating challenge
    return await this.store(body, category)
  }

  async updateChallenge(body: ChallengeInterface, id: string): Promise<Challenge> {
    this.logger.log(`updateChallenge - params: ${JSON.stringify(body)}`)

    // Validate changes
    if (!body.challengeDateTime && !body.status)  {
      throw new BadRequestException('Não há dados informados para atualziação do desafio!')
    }

    // Validate challenge
    const hasChallenge = await this.findById(id)
    if (!hasChallenge) {
      throw new NotFoundException(`Desafio de id ${id} não encontrado!`)
    }

    // Updating schema
    return await this.update(body, id)
  }

  // async assignChallengeMatch(body: ChallengeInterface, id: string): Promise<Challenge> {
  //   this.logger.log(`assignChallengeMatch - params: ${JSON.stringify(body)}`)

  //   //! Validate at gateway
  //   // Validate challenge
  //   // const hasChallenge = await this.findById(id)
  //   // if (!hasChallenge) {
  //   //   throw new NotFoundException(`Desafio de id ${id} não encontrado!`)
  //   // }

  //   //! Validate at gateway
  //   // Is winner a player from challenge
  //   // const isWinnerAChallenger = hasChallenge.players.find((p: any) => p._id === body.def)
  //   // if (!isWinnerAChallenger) {
  //   //   throw new BadRequestException(`O Jogador de id ${body.def} não está entre os jogadores do desafio!`)
  //   // }

  //   // Create match
  //   const createdMatch = await this.storeMatch(body, hasChallenge.category, hasChallenge.players)

  //   // Updating challenge
  //   return await this.updateChallengeStatus(id, ChallengeStatus.DONE, createdMatch._id)
  // }

  async findChallenge(id: string): Promise<Challenge> {
    const foundChallenge = await this.findById(id)
    // if (!foundChallenge) {
    //   throw new NotFoundException(`Desafio de id ${id} não encontrado!`)
    // }
    return foundChallenge
  }

  async findAllChallenges(id?: string): Promise<Challenge[]> {
    return id ? await this.findByPlayer(id) : await this.findAll()
  }

  async deleteChallenge(id: string): Promise<void> {
    const foundChallenge = await this.findById(id)
    if (!foundChallenge) {
      throw new NotFoundException(`Desafio de id ${id} não encontrado!`)
    }

    await this.delete(id)
  }

  // Persist methods
  async findById(id: string): Promise<Challenge> {
    return await this.challengeSchema.findOne({ _id: id })
      .populate('match')
  }

  private async findAll(): Promise<Challenge[]> {
    return await this.challengeSchema.find()
      .populate('match')
  }

  private async findByPlayer(id: string): Promise<Challenge[]> {
    return await this.challengeSchema.find({
      $or: [
        { players: { $in: [new ObjectId(id)] } },
        { requester: new ObjectId(id) }
      ]
    })
      .populate('match')
  }

  private async store(data: ChallengeInterface, category: any): Promise<Challenge> {
    try {

      const r = await this.challengeSchema.create({
        ...data,
        category: category.title,
        challengeRequestDateTime: new Date()
      })
      return r
      
    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async update(data: ChallengeInterface, id: string): Promise<Challenge> {
    try {

      const params = {}
      const { challengeDateTime, status } = data

      if (challengeDateTime) params['challengeDateTime'] = new Date(challengeDateTime)
      if (status) {
        params['status'] = status
        params['challengeResponseDateTime'] = new Date()
      }

      const r = await this.challengeSchema.findOneAndUpdate({
        _id: id
      }, {
        $set: { ...params }
      }, {
        new: true
      })
      // .populate('requester')
      .populate('match')
      // .populate('players')
      return r
      
    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async updateChallengeStatus(id: string, status: ChallengeStatus, match: ObjectId): Promise<Challenge> {
    try {

      const r = await this.challengeSchema.findOneAndUpdate({
        _id: id
      }, {
        $set: { 
          status: status,
          match: match
         }
      }, {
        new: true
      })
      .populate('requester')
      .populate('match')
      .populate('players')
      return r
      
    } catch(e) {
      await this.deleteMatch(match)
      throw new MongoError({ ...e })
    }
  }

  private async delete(id: string) {
    try {
      const r = await this.challengeSchema.deleteOne({ _id: id })
      return r.deletedCount ? true : false

    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async deleteMatch(id: ObjectId) {
    try {
      const r = await this.matchSchema.deleteOne({ _id: id })
      return r.deletedCount ? true : false

    } catch(e) {
      throw new MongoError({ ...e })
    }
  }
}