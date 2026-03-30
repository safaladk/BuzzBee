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

    const maxTickets = event.maxTicketsPerUser;
    if (maxTickets !== null && maxTickets > 0) {
      const existingBookings = await this.bookingRepo.find({
        where: { user: { id: user.id }, event: { id: event.id } },
      });
      const purchasedCount = existingBookings.reduce(
        (acc, booking) => acc + booking.quantity,
        0,
      );

      if (purchasedCount + dto.quantity > maxTickets) {
        throw new BadRequestException(
          `You can only purchase up to ${maxTickets} tickets for this event. You have already purchased ${purchasedCount}.`,
        );
      }
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

  async requestRefund(bookingId: number, userId: number, reason: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId, user: { id: userId } },
      relations: ['event'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'confirmed') {
      throw new BadRequestException('Only confirmed bookings can be refunded');
    }

    // Check if event has already passed
    const eventTime = new Date(booking.event.date).getTime();
    if (eventTime < Date.now()) {
      throw new BadRequestException('Cannot request refund for past events');
    }

    booking.status = 'refund_pending';
    booking.refundReason = reason;
    return this.bookingRepo.save(booking);
  }

  async getPendingRefunds() {
    return this.bookingRepo.find({
      where: { status: 'refund_pending' },
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  async processRefund(bookingId: number, status: 'refunded' | 'refund_rejected') {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['event'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'refund_pending') {
      throw new BadRequestException('No pending refund request for this booking');
    }

    if (status === 'refunded') {
      // Decrement attendees and revenue
      const event = booking.event;
      event.attendees = Math.max(0, event.attendees - booking.quantity);
      event.revenue = Math.max(0, Number(event.revenue) - Number(booking.totalPrice));
      await this.eventRepo.save(event);
    }

    booking.status = status;
    return this.bookingRepo.save(booking);
  }
}
