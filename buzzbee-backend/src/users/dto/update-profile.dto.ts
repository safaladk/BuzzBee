import { IsString, IsOptional } from 'class-validator';
import { IsArray } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsArray()
  @IsOptional()
  interestedCategories?: string[];

  @IsArray()
  @IsOptional()
  interestedLocations?: string[];
}
