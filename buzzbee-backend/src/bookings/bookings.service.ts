import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  async create(user: User, dto: CreateBookingDto) {
    const event = await this.eventRepo.findOne({ where: { id: dto.eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (
      event.capacity !== null &&
      event.attendees + dto.quantity > event.capacity
    ) {
      throw new BadRequestException('Not enough tickets available');
    }

    const booking = this.bookingRepo.create({
      user,
      event,
      quantity: dto.quantity,
      totalPrice: dto.totalPrice,
      status: 'confirmed',
    });

    const savedBooking = await this.bookingRepo.save(booking);

    // Update attendees and revenue in Event
    event.attendees += dto.quantity;
    event.revenue = Number(event.revenue) + Number(event.price) * dto.quantity;
    await this.eventRepo.save(event);

    return savedBooking;
  }

  async findByUser(userId: number) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEvent(eventId: number) {
    return this.bookingRepo.find({
      where: { event: { id: eventId } },
      relations: ['user'],
    });
  }
}
