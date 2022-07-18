// Dependencies
import { Document } from 'mongoose'

export interface PlayerInterface extends Document {
  phoneNumber: string
  email: string
  ranking: string
  avatar: string
  position: number
}