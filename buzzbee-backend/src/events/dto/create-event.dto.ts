import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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
  @Type(() => Number)
  price: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  capacity?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  serviceFee?: number;

  @IsString()
  @IsOptional()
  highlights?: string;

  @IsOptional()
  isPublished?: boolean;
}
