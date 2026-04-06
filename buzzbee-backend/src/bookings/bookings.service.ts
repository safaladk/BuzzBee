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
<<<<<<< Updated upstream
=======
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
>>>>>>> Stashed changes

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    private paymentsService: PaymentsService,
<<<<<<< Updated upstream
=======
    private notificationsService: NotificationsService,
    private usersService: UsersService,
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    const isPaidBooking = computedTotalPrice > 0;
    if (isPaidBooking) {
      if (!dto.paymentIntentId) {
        throw new BadRequestException('Payment intent is required for paid events');
=======
    // Points logic
    let remainingToPayInCash = computedTotalPrice;
    if (dto.pointsUsed && dto.pointsUsed > 0) {
      if (user.pointsBalance < dto.pointsUsed) {
        throw new BadRequestException('Insufficient points balance');
      }
      if (dto.pointsUsed > computedTotalPrice) {
        throw new BadRequestException(
          'Cannot use more points than total price',
        );
      }
      remainingToPayInCash = computedTotalPrice - dto.pointsUsed;
    }

    const isPaidBooking = remainingToPayInCash > 0;
    if (isPaidBooking) {
      if (!dto.paymentIntentId) {
        throw new BadRequestException(
          'Payment intent is required for paid events',
        );
>>>>>>> Stashed changes
      }

      const existingByIntent = await this.bookingRepo.findOne({
        where: { paymentIntentId: dto.paymentIntentId },
      });
      if (existingByIntent) {
<<<<<<< Updated upstream
        throw new BadRequestException('Payment has already been used for a booking');
=======
        throw new BadRequestException(
          'Payment has already been used for a booking',
        );
>>>>>>> Stashed changes
      }

      await this.paymentsService.verifySucceededPaymentIntent({
        paymentIntentId: dto.paymentIntentId,
<<<<<<< Updated upstream
        expectedTotalPrice: computedTotalPrice,
=======
        expectedTotalPrice: remainingToPayInCash,
>>>>>>> Stashed changes
        eventId: event.id,
        userId: user.id,
      });
    }

<<<<<<< Updated upstream
=======
    // Deduct points from user
    if (dto.pointsUsed && dto.pointsUsed > 0) {
      await this.usersService.updatePointsBalance(user.id, -dto.pointsUsed);
    }

>>>>>>> Stashed changes
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

    // Notify user
    await this.notificationsService.create(
      user,
      `You booked ${dto.quantity} ticket${dto.quantity > 1 ? 's' : ''} for "${
        event.title
      }".`,
    );

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
      relations: ['event', 'user'],
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

    // Calculate refund points
    const refundPoints = this.calculateRefundPoints(
      booking.totalPrice,
      booking.event.date,
    );

    booking.status = 'refund_pending';
    booking.refundReason = reason;
    booking.refundAmountPoints = refundPoints;
    booking.refundRequestedAt = new Date();
    return this.bookingRepo.save(booking);
  }

  private calculateRefundPoints(totalPrice: number, eventDate: Date): number {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    const diffMs = eventTime - now;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    let refundPercent = 0;
    if (diffDays >= 7) {
      refundPercent = 0.9;
    } else if (diffDays >= 3) {
      refundPercent = 0.75;
    } else if (diffDays >= 1) {
      refundPercent = 0.5;
    } else {
      refundPercent = 0; // Less than 24h
    }

    return Number((Number(totalPrice) * refundPercent).toFixed(2));
  }

  async getPendingRefunds() {
    return this.bookingRepo.find({
      where: { status: 'refund_pending' },
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  async processRefund(
    bookingId: number,
    status: 'refunded' | 'refund_rejected',
  ) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['event', 'user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'refund_pending') {
      throw new BadRequestException(
        'No pending refund request for this booking',
      );
    }

    if (status === 'refunded') {
      // Decrement attendees and revenue
      const event = booking.event;
      event.attendees = Math.max(0, event.attendees - booking.quantity);
      event.revenue = Math.max(
        0,
        Number(event.revenue) - Number(booking.totalPrice),
      );
      await this.eventRepo.save(event);

      // Add points to user's balance
      if (booking.refundAmountPoints > 0) {
        await this.usersService.updatePointsBalance(
          booking.user.id,
          booking.refundAmountPoints,
        );
      }

      // Notify user
      await this.notificationsService.create(
        booking.user,
        `Your refund of ${booking.refundAmountPoints} BuzzBee points for "${booking.event.title}" has been approved.`,
      );
    }

    booking.status = status;
    return this.bookingRepo.save(booking);
  }

  async refundAllForEvent(eventId: number) {
    const bookings = await this.bookingRepo.find({
      where: { event: { id: eventId }, status: 'confirmed' },
      relations: ['user', 'event'],
    });

    for (const booking of bookings) {
      // 100% refund for cancelled events
      const refundPoints = Number(booking.totalPrice);

      booking.status = 'refunded';
      booking.refundAmountPoints = refundPoints;
      await this.bookingRepo.save(booking);

      await this.usersService.updatePointsBalance(
        booking.user.id,
        refundPoints,
      );

      await this.notificationsService.create(
        booking.user,
        `The event "${booking.event.title}" was cancelled. 100% of your payment (${refundPoints} BuzzBee points) has been returned to your wallet.`,
      );
    }
  }
}
