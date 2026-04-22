import { IsString, IsOptional } from 'class-validator';
import { IsArray } from 'class-validator';

export class UpdateProfileDto {
  /**
   * Updated full name of the user
   */
  @IsString()
  @IsOptional()
  fullName?: string;

  /**
   * Updated list of event category interests
   */
  @IsArray()
  @IsOptional()
  interestedCategories?: string[];

  /**
   * Updated list of preferred event locations/districts
   */
  @IsArray()
  @IsOptional()
  interestedLocations?: string[];
}
