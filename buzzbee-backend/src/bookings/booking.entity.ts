import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Event)
  event: Event;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ default: 'confirmed' })
  status: string; // 'pending' | 'confirmed' | 'cancelled'

  @Column({ type: 'varchar', nullable: true })
  paymentIntentId: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmountPoints: number;

  @Column({ type: 'text', nullable: true })
  refundReason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  refundRequestedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
