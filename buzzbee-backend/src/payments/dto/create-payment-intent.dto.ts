import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  eventId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;
}
