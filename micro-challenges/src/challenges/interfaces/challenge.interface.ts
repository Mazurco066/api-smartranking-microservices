// Dependencies
import { ChallengeStatus } from '../enums'

export interface ChallengeInterface {
  challengeDateTime: Date
  status: ChallengeStatus
  challengeRequestDateTime: Date
  challengeResponseDateTime: Date
  category: string
  requester: string
  match: string
  players: string[]
}
