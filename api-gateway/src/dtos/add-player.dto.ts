// Dependencies
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AddPlayerDTO {
  @IsNotEmpty({ message: 'Campo "phoneNumer" não deve ser vazio' })
  @IsString({ message: 'Campo "phoneNumer" deve ser do tipo String' })
  readonly phoneNumber: string

  @IsNotEmpty({ message: 'Campo "email" não deve ser vazio' })
  @IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsEmail({}, { message: 'Campo "email" deve conter um endereço valido' })
  readonly email: string

  @IsNotEmpty({ message: 'Campo "name" não deve ser vazio' })
  @IsString({ message: 'Campo "name" deve ser do tipo String' })
  readonly name: string
}
