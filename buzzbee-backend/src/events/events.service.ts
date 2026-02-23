import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    @InjectRepository(Event)
    private repo: Repository<Event>,
  ) {}

  async onModuleInit() {
    console.log('Syncing revenue for existing events...');
    await this.syncRevenue();
  }

  create(dto: CreateEventDto) {
    const event = this.repo.create(dto);
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

  findAll() {
    return this.repo.find({ where: { isPublished: true } });
  }

  async findOne(id: number) {
    const event = await this.repo.findOne({ where: { id, isPublished: true } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async syncRevenue() {
    const events = await this.repo.find();
    for (const event of events) {
      event.revenue = Number(event.price) * (event.attendees || 0);
      await this.repo.save(event);
    }
    return { success: true, count: events.length };
  }
}
