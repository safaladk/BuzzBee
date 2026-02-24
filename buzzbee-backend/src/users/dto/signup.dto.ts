import {
  IsEmail,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  role?: string; // 'attendee' | 'organizer'

  @IsBoolean()
  @IsOptional()
  termsAccepted?: boolean;
}
