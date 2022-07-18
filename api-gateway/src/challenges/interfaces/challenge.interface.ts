// Dependencies
import { ChallengeStatus } from '../enums'
import { Player } from '../../players/interfaces'

export interface Challenge {
  challengeDateTime: Date
  status: ChallengeStatus
  challengeRequestDateTime: Date
  challengeResponseDateTime: Date
  category: string
  requester: string
  match?: string
  players: Player[]
}