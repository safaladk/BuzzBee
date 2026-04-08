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
import { CreateSponsorshipIntentDto } from './dto/create-sponsorship-intent.dto';

const SPONSORSHIP_PLANS: Record<number, number> = {
  3: 500, // 3 days for Rs 500
  7: 1000, // 7 days for Rs 1000
  30: 3500, // 30 days for Rs 3500
};

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

    let remainingToPay = totalPrice;
    if (dto.pointsUsed && dto.pointsUsed > 0) {
      if (user.pointsBalance < dto.pointsUsed) {
        throw new BadRequestException('Insufficient points balance');
      }
      if (dto.pointsUsed > totalPrice) {
        throw new BadRequestException(
          'Cannot use more points than total price',
        );
      }
      remainingToPay = totalPrice - dto.pointsUsed;
    }

    if (remainingToPay <= 0) {
      throw new BadRequestException(
        'No cash payment required. Please book using points directly.',
      );
    }

    const normalizedCurrency = (
      process.env.STRIPE_CURRENCY || 'inr'
    ).toLowerCase();
    const amountInMinorUnit = Math.round(remainingToPay * 100);

    const stripe = this.getStripeClient();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInMinorUnit,
      currency: normalizedCurrency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        eventId: String(event.id),
        userId: String(user.id),
        quantity: String(dto.quantity),
        pointsUsed: String(dto.pointsUsed || 0),
      },
    });

    if (!paymentIntent.client_secret) {
      throw new BadRequestException('Unable to create payment session');
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: remainingToPay,
      currency: normalizedCurrency,
      eventId: event.id,
      quantity: dto.quantity,
      totalPrice: totalPrice, // Original total
      pointsUsed: dto.pointsUsed || 0,
    };
  }

  async verifySucceededPaymentIntent(params: {
    paymentIntentId: string;
    expectedTotalPrice: number;
    eventId: number;
    userId: number;
  }) {
    const stripe = this.getStripeClient();

    const intent = await stripe.paymentIntents.retrieve(params.paymentIntentId);

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

  async createSponsorshipIntent(user: User, dto: CreateSponsorshipIntentDto) {
    const event = await this.eventRepo.findOne({
      where: { id: dto.eventId, organizer: { id: user.id } },
    });
    if (!event) {
      throw new NotFoundException('Event not found or unauthorized');
    }

    if (!user.isVerified) {
      throw new BadRequestException(
        'Only verified organizers can boost events',
      );
    }

    if (event.status !== 'APPROVED') {
      throw new BadRequestException(
        'Only verified (approved) events can be boosted',
      );
    }

    const price = SPONSORSHIP_PLANS[dto.days];
    if (!price) {
      throw new BadRequestException('Invalid sponsorship plan selected');
    }

    const normalizedCurrency = (
      process.env.STRIPE_CURRENCY || 'inr'
    ).toLowerCase();
    const amountInMinorUnit = Math.round(price * 100);

    const stripe = this.getStripeClient();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInMinorUnit,
      currency: normalizedCurrency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'SPONSORSHIP',
        eventId: String(event.id),
        userId: String(user.id),
        days: String(dto.days),
      },
    });

    if (!paymentIntent.client_secret) {
      throw new BadRequestException('Unable to create payment session');
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: price,
      currency: normalizedCurrency,
      eventId: event.id,
      days: dto.days,
    };
  }

  async verifySucceededSponsorshipIntent(params: {
    paymentIntentId: string;
    eventId: number;
    userId: number;
  }) {
    const stripe = this.getStripeClient();
    const intent = await stripe.paymentIntents.retrieve(params.paymentIntentId);

    if (intent.status !== 'succeeded') {
      throw new BadRequestException('Payment is not completed');
    }

    if (intent.metadata?.type !== 'SPONSORSHIP') {
      throw new BadRequestException('Not a sponsorship payment');
    }

    if (Number(intent.metadata?.eventId) !== params.eventId) {
      throw new BadRequestException('Payment event mismatch');
    }

    if (Number(intent.metadata?.userId) !== params.userId) {
      throw new BadRequestException('Payment owner mismatch');
    }

    return {
      success: true,
      days: Number(intent.metadata.days),
    };
  }

  async autoBoostEvent(id: number, days: number) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + days);

    event.isSponsored = true;
    event.sponsorshipStatus = 'APPROVED';
    event.sponsoredAt = now;
    event.sponsoredUntil = expiry;

    return this.eventRepo.save(event);
  }
}
