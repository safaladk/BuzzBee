import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  /**
   * Unique identifier for the user
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Full name of the user
   */
  @Column({ nullable: true })
  fullName: string;

  /**
   * Unique email address used for login
   */
  @Column({ unique: true })
  email: string;

  /**
   * Hashed account password (hidden in responses usually)
   */
  @Column()
  password: string;

  /**
   * User's system role
   * @example "attendee"
   */
  @Column({ default: 'attendee' })
  role: string; // 'attendee' | 'organizer' | 'admin'

  /**
   * Whether the user accepted terms during signup
   */
  @Column({ default: false })
  termsAccepted: boolean;

  /**
   * Verification status (primarily for organizers)
   */
  @Column({ default: false })
  isVerified: boolean;

  /**
   * List of URLs/Paths for uploaded verification documents
   */
  @Column({ type: 'text', nullable: true, array: true })
  verificationDocs: string[];

  /**
   * List of event categories the user is interested in
   */
  @Column({ type: 'text', nullable: true, array: true })
  interestedCategories: string[];

  /**
   * List of geographical districts the user is interested in
   */
  @Column({ type: 'text', nullable: true, array: true })
  interestedLocations: string[];

  /**
   * Current loyalty points balance (1 point = Rs 1)
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pointsBalance: number;

  /**
   * Record creation timestamp
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Last record update timestamp
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
