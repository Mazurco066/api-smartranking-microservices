// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes } from 'mongoose'
import { ObjectId } from 'mongodb'

// Nested objects
export interface Result {
  set: string
}

// Model
@Schema({ timestamps: true, collection: 'Matchs' })
export class Match {
  @Prop({ type: String, default: () => new ObjectId(), required: false })
  _id: ObjectId

  @Prop({ required: true })
  category: string

  @Prop({ type: SchemaTypes.ObjectId }) // ref: 'Player'
  def: ObjectId

  @Prop({ required: false, default: () => [] })
  result: Result[]

  @Prop({ type: [SchemaTypes.ObjectId], default: [] }) // ref: 'Player'
  players: ObjectId[]
}

// Model + Document
export type MatchDocument = Match & Document

// Schema
export const MatchSchema = SchemaFactory.createForClass(Match)
