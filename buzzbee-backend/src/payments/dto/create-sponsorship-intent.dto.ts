import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSponsorshipIntentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({ example: 7, description: 'Number of days to boost (3, 7, 30)' })
  @IsNumber()
  @IsNotEmpty()
  days: number;
}
