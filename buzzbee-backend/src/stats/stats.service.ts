import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { Booking } from '../bookings/booking.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  async getSummary() {
    const eventsCount = await this.eventRepo.count({
      where: { isPublished: true },
    });
    const usersCount = await this.userRepo.count();
    const organizersCount = await this.userRepo.count({
      where: { role: 'organizer' },
    });

    // Get unique cities (districts)
    const citiesResult = await this.eventRepo
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.district)', 'count')
      .where('event.isPublished = :isPublished', { isPublished: true })
      .getRawOne<{ count: string }>();

    const citiesCount = parseInt(citiesResult?.count || '0', 10);

    // Get total settled revenue
    const revenueResult = await this.eventRepo
      .createQueryBuilder('event')
      .select('SUM(event.revenue)', 'total')
      .getRawOne<{ total: string }>();

    const totalSettled = parseFloat(revenueResult?.total || '0');

    // Get total escrow
    const escrowResult = await this.eventRepo
      .createQueryBuilder('event')
      .select('SUM(event.escrowRevenue)', 'total')
      .getRawOne<{ total: string }>();
    const totalEscrow = parseFloat(escrowResult?.total || '0');

    // Get total refunded
    const refundResult = await this.bookingRepo
      .createQueryBuilder('booking')
      .select('SUM(booking.refundAmountPoints)', 'total')
      .where('booking.status = :status', { status: 'refunded' })
      .getRawOne<{ total: string }>();
    const totalRefunded = parseFloat(refundResult?.total || '0');

    return {
      eventsCount,
      usersCount,
      organizersCount,
      citiesCount,
      totalRevenue: totalSettled + totalEscrow, // Platform life-to-date potential
      totalSettled,
      totalEscrow,
      totalRefunded,
    };
  }
}
