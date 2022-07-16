// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes } from 'mongoose'
import { ObjectId } from 'mongodb'

// Nested props
export interface Event {
  name: string
  operation: string
  value: number
}

// Model
@Schema({ timestamps: true, collection: 'Categories'})
export class Category {
  @Prop({ type: String, default: () => new ObjectId(), required: false })
  _id: ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: false, default: () => [] })
  events: Event[]

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Player', default: [] })
  players: ObjectId[]
}

// Model + Document
export type CategoryDocument = Category & Document

// Schema
export const CategorySchema = SchemaFactory.createForClass(Category)
