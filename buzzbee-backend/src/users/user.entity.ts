import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'attendee' })
  role: string; // 'attendee' | 'organizer' | 'admin'

  @Column({ default: false })
  termsAccepted: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'text', nullable: true, array: true })
  verificationDocs: string[];

  @Column({ type: 'text', nullable: true, array: true })
  interestedCategories: string[];

  @Column({ type: 'text', nullable: true, array: true })
  interestedLocations: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pointsBalance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
