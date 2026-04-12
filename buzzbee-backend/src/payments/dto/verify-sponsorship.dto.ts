import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifySponsorshipDto {
  @ApiProperty({ example: 'pi_3QX...' })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  eventId: number;
}
