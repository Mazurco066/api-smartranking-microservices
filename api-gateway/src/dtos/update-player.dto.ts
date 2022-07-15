// Dependencies
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePlayerDTO {
  @IsNotEmpty({ message: 'Campo "phoneNumer" não deve ser vazio' })
  @IsString({ message: 'Campo "phoneNumer" deve ser do tipo String' })
  readonly phoneNumber: string

  @IsNotEmpty({ message: 'Campo "name" não deve ser vazio' })
  @IsString({ message: 'Campo "name" deve ser do tipo String' })
  readonly name: string
}
