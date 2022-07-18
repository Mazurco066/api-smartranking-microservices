// Dependencies
import { PipeTransform, BadRequestException, ArgumentMetadata } from '@nestjs/common'
import { ChallengeStatus } from '../enums'

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly alowedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DECLINED,
    ChallengeStatus.CANCELED
  ]

  transform(value: any, _: ArgumentMetadata) {
    const status = value.status.toUpperCase()

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} é um status inválido!`)
    }
  }

  private isValidStatus (status: any) {
    const idx = this.alowedStatus.indexOf(status)
    return idx !== -1
  }
}
