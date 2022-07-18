// Dependencies
import { IsOptional, IsDateString, IsEnum } from 'class-validator'
import { ChallengeStatus } from '../enums'

// DTO
export class UpdateChallengeDTO {
  @IsOptional()
  @IsDateString({}, { message: 'Campo "challengeDateTime" deve ser do tipo Data' })
  readonly challengeDateTime: string

  @IsOptional()
  @IsEnum(ChallengeStatus, { message: 'Status deve ser: "ACCEPTED", "DECLINED" or "CANCELED"' })
  readonly status: ChallengeStatus
}
