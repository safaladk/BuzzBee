import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  eventId!: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  totalPrice!: number;

  @IsString()
  @IsOptional()
  paymentIntentId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pointsUsed?: number;
}
