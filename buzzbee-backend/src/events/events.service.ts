import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository, IsNull, FindOptionsWhere } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/user.entity';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    @InjectRepository(Event)
    private repo: Repository<Event>,
    private bookingsService: BookingsService,
  ) {}

  async onModuleInit() {
    console.log('Syncing revenue for existing events...');
    await this.syncRevenue();
  }

  create(dto: CreateEventDto, organizer?: User) {
    const event = this.repo.create({
      ...dto,
      organizer,
      status: 'PENDING',
    });
    return this.repo.save(event);
  }

  async update(id: number, dto: CreateEventDto) {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    Object.assign(event, dto);
    return this.repo.save(event);
  }

  async remove(id: number) {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    await this.repo.remove(event);
    return { success: true };
  }

  async cancelEvent(id: number, organizerId?: number) {
    const whereClause: FindOptionsWhere<Event> = { id };
    if (organizerId) {
      whereClause.organizer = { id: organizerId };
    }

    const event = await this.repo.findOne({ where: whereClause });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status === 'CANCELLED') {
      return event;
    }

    event.status = 'CANCELLED';
    await this.repo.save(event);

    // Automatically refund all attendees
    await this.bookingsService.refundAllForEvent(id);

    return event;
  }

  findAll(category?: string, location?: string) {
    const where: FindOptionsWhere<Event> = {
      isPublished: true,
      status: 'APPROVED',
      date: MoreThanOrEqual(new Date()),
    };

    if (category) {
      where.category = category;
    }

    if (location) {
      where.district = location;
    }

    return this.repo.find({
      where,
      order: { date: 'ASC' },
    });
  }

  async findOne(id: number) {
    const event = await this.repo.findOne({
      where: { id, isPublished: true, status: 'APPROVED' },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  findByOrganizer(organizerId: number) {
    if (!organizerId) return [];
    return this.repo.find({
      where: { organizer: { id: organizerId } },
      order: { createdAt: 'DESC' },
    });
  }

  async syncRevenue() {
    const events = await this.repo.find();
    for (const event of events) {
      const totalPotential = Number(event.price) * (event.attendees || 0);
      if (event.isSettled) {
        event.revenue = totalPotential;
        event.escrowRevenue = 0;
      } else {
        // If not settled, most of it should be in escrow
        event.escrowRevenue = totalPotential;
        event.revenue = 0;
      }
      await this.repo.save(event);
    }
    return { success: true, count: events.length };
  }

  async requestSponsorship(id: number, organizerId: number) {
    const event = await this.repo.findOne({
      where: { id, organizer: { id: organizerId } },
    });
    if (!event) throw new NotFoundException('Event not found or unauthorized');

    event.sponsorshipStatus = 'PENDING';
    return this.repo.save(event);
  }

  async updateSponsorshipStatus(id: number, status: 'APPROVED' | 'REJECTED') {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    event.sponsorshipStatus = status;
    event.isSponsored = status === 'APPROVED';
    return this.repo.save(event);
  }

  getSponsoredEvents() {
    const now = new Date();
    return this.repo.find({
      where: [
        {
          isPublished: true,
          status: 'APPROVED',
          isSponsored: true,
          date: MoreThanOrEqual(now),
          sponsoredUntil: MoreThanOrEqual(now),
        },
        {
          isPublished: true,
          status: 'APPROVED',
          isSponsored: true,
          date: MoreThanOrEqual(now),
          sponsoredUntil: IsNull(),
        },
      ],
      order: { date: 'ASC' },
    });
  }

  getPendingSponsorships() {
    return this.repo.find({
      where: { sponsorshipStatus: 'PENDING' },
      order: { createdAt: 'DESC' },
    });
  }
}
