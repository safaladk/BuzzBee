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
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    private paymentsService: PaymentsService,
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

    const unitPrice = Number(event.price || 0);
    const serviceFee = Number(event.serviceFee || 0);
    const computedTotalPrice = unitPrice * dto.quantity + serviceFee;

    if (Math.abs(Number(dto.totalPrice) - computedTotalPrice) > 0.01) {
      throw new BadRequestException('Total price mismatch');
    }

    const isPaidBooking = computedTotalPrice > 0;
    if (isPaidBooking) {
      if (!dto.paymentIntentId) {
        throw new BadRequestException('Payment intent is required for paid events');
      }

      const existingByIntent = await this.bookingRepo.findOne({
        where: { paymentIntentId: dto.paymentIntentId },
      });
      if (existingByIntent) {
        throw new BadRequestException('Payment has already been used for a booking');
      }

      await this.paymentsService.verifySucceededPaymentIntent({
        paymentIntentId: dto.paymentIntentId,
        expectedTotalPrice: computedTotalPrice,
        eventId: event.id,
        userId: user.id,
      });
    }

    const booking = this.bookingRepo.create({
      user,
      event,
      quantity: dto.quantity,
      totalPrice: computedTotalPrice,
      paymentIntentId: dto.paymentIntentId ?? null,
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
