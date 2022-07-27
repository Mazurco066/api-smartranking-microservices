// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes } from 'mongoose'
import { ObjectId } from 'mongodb'

// Types
import { ChallengeStatus } from '../enums'

// Model
@Schema({ timestamps: true, collection: 'Challenges'})
export class Challenge {
  @Prop({ type: String, default: () => new ObjectId(), required: false })
  _id: ObjectId

  @Prop({ required: true })
  challengeDateTime: Date

  @Prop({ required: false, default: ChallengeStatus.PENDING })
  status: ChallengeStatus

  @Prop({ required: true })
  challengeRequestDateTime: Date

  @Prop({ required: false })
  challengeResponseDateTime: Date

  @Prop({ required: true })
  category: string

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Player' })
  requester: ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Match' })
  match: ObjectId

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Player', default: [] })
  players: ObjectId[]
}

// Model + Document
export type ChallengeDocument = Challenge & Document

// Schema
export const ChallengeSchema = SchemaFactory.createForClass(Challenge)
