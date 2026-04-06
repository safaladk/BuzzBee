import { Type } from 'class-transformer';
<<<<<<< Updated upstream
import { IsNotEmpty, IsNumber } from 'class-validator';
=======
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
>>>>>>> Stashed changes

export class CreatePaymentIntentDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  eventId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;
<<<<<<< Updated upstream
=======

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pointsUsed?: number;
>>>>>>> Stashed changes
}
