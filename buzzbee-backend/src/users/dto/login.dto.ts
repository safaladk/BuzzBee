import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  /**
   * User registration email
   * @example "user@example.com"
   */
  @IsEmail()
  email: string;

  /**
   * Account password
   */
  @IsString()
  password: string;
}
