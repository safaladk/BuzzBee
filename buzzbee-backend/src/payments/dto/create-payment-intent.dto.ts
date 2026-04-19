import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  eventId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pointsUsed?: number;

  @IsOptional()
  @IsString()
  tierName?: string;
}