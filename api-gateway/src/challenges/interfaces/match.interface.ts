// Dependencies
import { Player } from '../../players/interfaces'

export interface Result {
  set: string
}

export interface Match {
  category: string
  def?: Player
  result: Result[]
  players: Player[]
}