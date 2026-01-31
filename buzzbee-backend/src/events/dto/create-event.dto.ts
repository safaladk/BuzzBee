import { IsString, IsDateString, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  location: string;

  @IsString()
  district: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  @IsUrl()
  image?: string;
}