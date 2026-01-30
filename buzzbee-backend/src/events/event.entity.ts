import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column()
  date: Date;

  @Column()
  price: number;

  @Column({ default: false })
  isPublished: boolean;
}