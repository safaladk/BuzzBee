import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsString()
  location: string;

  @IsDateString()
  date: string;

  @IsNumber()
  price: number;
}