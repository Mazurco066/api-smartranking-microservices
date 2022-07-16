// Dependencies
import { Document } from 'mongoose'

export interface EventInterface {
  name: string
  operation: string
  value: number
}

export interface CategoryInterface extends Document {
  readonly title: string
  description: string
  events: Array<EventInterface>
}