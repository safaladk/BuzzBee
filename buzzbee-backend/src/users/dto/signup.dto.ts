import {
  IsEmail,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  /**
   * The user's full name
   * @example "John Doe"
   */
  @IsString()
  @IsOptional()
  fullName?: string;

  /**
   * Unique email address for registration
   * @example "user@example.com"
   */
  @IsEmail()
  email: string;

  /**
   * Account security password (min 6 characters)
   */
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * User role on the platform
   * @default "attendee"
   */
  @IsString()
  @IsOptional()
  role?: string; // 'attendee' | 'organizer'

  /**
   * Whether the user has accepted the platform terms and conditions
   */
  @IsBoolean()
  @IsOptional()
  termsAccepted?: boolean;
}
