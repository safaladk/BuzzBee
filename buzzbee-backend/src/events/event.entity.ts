import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column()
  location: string;

  @Column()
  district: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFee: number;

  @Column({ type: 'text', nullable: true })
  highlights: string;

  @Column({ type: 'jsonb', nullable: true })
  ticketTiers: { name: string; price: number; capacity: number }[];

  @Column({ type: 'int', default: 0 })
  attendees: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  escrowRevenue: number;

  @Column({ default: false })
  isSettled: boolean;

  @Column({ type: 'int', nullable: true, default: null })
  maxTicketsPerUser: number;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REPORTED' | 'CANCELLED';

  @Column({ type: 'text', nullable: true })
  rejectionNote: string;

  @Column({ default: false })
  isSponsored: boolean;

  @Column({ default: 'NONE' })
  sponsorshipStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

  @ManyToOne(() => User, { eager: true })
  organizer: User;

  @Column({ type: 'timestamp', nullable: true })
  sponsoredUntil: Date;

  @Column({ type: 'timestamp', nullable: true })
  sponsoredAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
