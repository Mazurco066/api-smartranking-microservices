// Dependencies
import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, ArrayMinSize } from 'class-validator'
import { Type } from 'class-transformer'

// Interface
export interface Events {
  name: string
  operation: string
  value: number
}

// DTO
export class EventsDTO {
  @IsString({ message: '"name" deve ser do tipo String' })
  @IsNotEmpty({ message: '"name" não deve ser vazio' })
  name: string

  @IsString({ message: '"operation" deve ser do tipo String' })
  @IsNotEmpty({ message: '"operation" não deve ser vazio' })
  operation: string

  @IsNumber({}, { message: '"value" deve ser do tipo String' })
  @IsNotEmpty({ message: '"value" não deve ser vazio' })
  value: number
}

export class AddCategoryDTO {
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @IsString({ message: 'Campo "title" deve ser do tipo String' })
  readonly title: string

  @IsNotEmpty({ message: 'Campo "description" não deve ser vazio' })
  @IsString({ message: 'Campo "description" deve ser do tipo String' })
  readonly description: string

  @IsArray({ message: 'Campo "events" deve ser do tipo Array' })
  @ArrayMinSize(1, { message: 'Campo "events" deve conter no mínimo 1 evento' })
  @ValidateNested()
  @Type(() => EventsDTO)
  readonly events: Events[]
}
