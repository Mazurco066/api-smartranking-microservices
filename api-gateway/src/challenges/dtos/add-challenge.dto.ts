// Dependencies
import { IsArray, IsNotEmpty, IsString, IsDateString, ArrayMinSize, ArrayMaxSize } from 'class-validator'

// DTO
export class AddChallengeDTO {
  @IsNotEmpty({ message: 'Campo "challengeDateTime" não deve ser vazio' })
  @IsDateString({}, { message: 'Campo "challengeDateTime" deve ser do tipo Data' })
  readonly challengeDateTime: string

  @IsNotEmpty({ message: 'Campo "requester" não deve ser vazio' })
  @IsString({ message: 'Campo "requester" deve ser do tipo String' })
  readonly requester: string

  @IsNotEmpty({ message: 'Campo "category" não deve ser vazio' })
  @IsString({ message: 'Campo "category" deve ser do tipo String' })
  readonly category: string


  @IsArray({ message: 'Campo "players" deve ser do tipo Array' })
  @ArrayMinSize(2, { message: 'Campo "players" deve conter exatamente 2 jogadores' })
  @ArrayMaxSize(2, { message: 'Campo "players" deve conter exatamente 2 jogadores' })
  readonly players: string[]
}
