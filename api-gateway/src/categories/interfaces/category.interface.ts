export interface Events {
  name: string
  operation: string
  value: number
}

export interface Category {
  title: string
  description: string
  events: Events[]
  players: string[]
}