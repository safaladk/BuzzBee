import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private repo: Repository<Event>,
  ) {}

  create(dto: CreateEventDto) {
    const event = this.repo.create(dto);
    return this.repo.save(event);
  }

  findAll() {
    return this.repo.find({ where: { isPublished: true } });
  }
}
