import { IsString, IsDateString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  /**
   * The title of the event
   * @example "Kathmandu Music Festival"
   */
  @IsString()
  title: string;

  /**
   * Detailed description of the event
   */
  @IsString()
  description: string;

  /**
   * Event category (e.g., Music, Food, Sports)
   */
  @IsString()
  category: string;

  /**
   * The date when the event will take place
   * @example "2024-12-31"
   */
  @IsDateString()
  date: string;

  /**
   * The starting time of the event
   * @example "18:00"
   */
  @IsString()
  time: string;

  /**
   * Specific venue or location name
   */
  @IsString()
  location: string;

  /**
   * The district where the event is located
   */
  @IsString()
  district: string;

  /**
   * Base price for a single ticket
   */
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  /**
   * URL to the event's promotional image
   */
  @IsString()
  @IsOptional()
  image?: string;

  /**
   * Maximum number of attendees allowed
   */
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  capacity?: number;

  /**
   * Platform service fee charged per ticket
   */
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  serviceFee?: number;

  /**
   * Key highlights or features of the event (comma separated)
   */
  @IsString()
  @IsOptional()
  highlights?: string;

  /**
   * Whether the event should be publicly visible immediately
   */
  @IsOptional()
  isPublished?: boolean;

  /**
   * Limit on how many tickets a single user account can purchase
   */
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  maxTicketsPerUser?: number;

  /**
   * Detailed ticket categories with specific prices and capacities
   */
  @IsOptional()
  ticketTiers?: { name: string; price: number; capacity: number }[];
}
