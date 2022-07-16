// Dependencies
import { Document } from 'mongoose'

export interface Player extends Document {
  phoneNumber: string
  email: string
  ranking: string
  avatar: string
  position: number
}