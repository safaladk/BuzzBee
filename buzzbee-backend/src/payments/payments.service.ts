import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { Booking } from '../bookings/booking.entity';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe | null;

  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    this.stripe = secretKey ? new Stripe(secretKey) : null;
  }

  private getStripeClient() {
    if (!this.stripe) {
      throw new BadRequestException(
        'Stripe is not configured on server. Set STRIPE_SECRET_KEY.',
      );
    }

    return this.stripe;
  }

  async createPaymentIntent(user: User, dto: CreatePaymentIntentDto) {
    const event = await this.eventRepo.findOne({ where: { id: dto.eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
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
    const totalPrice = unitPrice * dto.quantity + serviceFee;

    if (totalPrice <= 0) {
      throw new BadRequestException(
        'This event does not require payment. Complete a free booking directly.',
      );
    }

    const normalizedCurrency = (process.env.STRIPE_CURRENCY || 'inr').toLowerCase();
    const amountInMinorUnit = Math.round(totalPrice * 100);

    const stripe = this.getStripeClient();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInMinorUnit,
      currency: normalizedCurrency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        eventId: String(event.id),
        userId: String(user.id),
        quantity: String(dto.quantity),
      },
    });

    if (!paymentIntent.client_secret) {
      throw new BadRequestException('Unable to create payment session');
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalPrice,
      currency: normalizedCurrency,
      eventId: event.id,
      quantity: dto.quantity,
      totalPrice,
    };
  }

  async verifySucceededPaymentIntent(params: {
    paymentIntentId: string;
    expectedTotalPrice: number;
    eventId: number;
    userId: number;
  }) {
    const stripe = this.getStripeClient();

    const intent = await stripe.paymentIntents.retrieve(
      params.paymentIntentId,
    );

    if (intent.status !== 'succeeded') {
      throw new BadRequestException('Payment is not completed');
    }

    const expectedMinor = Math.round(params.expectedTotalPrice * 100);
    if (intent.amount !== expectedMinor) {
      throw new BadRequestException('Payment amount mismatch');
    }

    if (Number(intent.metadata?.eventId) !== params.eventId) {
      throw new BadRequestException('Payment event mismatch');
    }

    if (Number(intent.metadata?.userId) !== params.userId) {
      throw new BadRequestException('Payment owner mismatch');
    }

    return intent;
  }
}
