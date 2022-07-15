// Dependencies
import { IsArray, IsString, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator'
import { Type } from 'class-transformer'
import { Events, EventsDTO } from './add-category.dto'

// DTO
export class UpdateCategoryDTO {
  @IsOptional()
  @IsString({ message: 'Campo "description" deve ser do tipo String' })
  readonly description: string

  @IsArray({ message: 'Campo "events" deve ser do tipo Array' })
  @ArrayMinSize(1, { message: 'Campo "events" deve conter no mínimo 1 evento' })
  @ValidateNested()
  @Type(() => EventsDTO)
  readonly events: Events[]
}
