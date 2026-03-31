import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interestedCategories?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interestedLocations?: string[];
}
