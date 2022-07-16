// Dependencies
import { Document } from 'mongoose'

export interface Event {
  name: string
  operation: string
  value: number
}

export interface Category extends Document {
  readonly title: string
  description: string
  events: Array<Event>
}