// Dependencies
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

// Interfaces
export interface Result {
  set: string
}

// DTO's
export class MatchDTO {
  @IsNotEmpty({ message: 'Campo "set" não deve ser  vazio' })
  @IsString({ message: 'Campo "set deve ser do tipo String"' })
  set: string
}

export class AssignChallengeDTO {
  @IsNotEmpty({ message: 'Campo "def" não deve ser vazio' })
  @IsString({ message: 'Campo "def" deve ser do tipo String' })
  readonly def: string

  @IsNotEmpty({ message: 'Campo "result" não deve ser vazio' })
  @IsArray({ message: 'Campo "result" deve ser do tipo Array' })
  @ValidateNested()
  @Type(() => MatchDTO)
  readonly result: Result[]
}
