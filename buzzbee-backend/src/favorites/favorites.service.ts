import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { Event } from '../events/event.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favRepo: Repository<Favorite>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  async addFavorite(user: any, eventId: number) {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    const existing = await this.favRepo.findOne({
      where: { user: { id: user.id }, event: { id: eventId } },
    });
    if (existing) throw new ConflictException('Already favorited');

    const favorite = this.favRepo.create({ user: { id: user.id }, event });
    return this.favRepo.save(favorite);
  }

  async removeFavorite(user: any, eventId: number) {
    const favorite = await this.favRepo.findOne({
      where: { user: { id: user.id }, event: { id: eventId } },
    });
    if (!favorite) throw new NotFoundException('Favorite not found');

    return this.favRepo.remove(favorite);
  }

  async getUserFavorites(user: any) {
    return this.favRepo.find({
      where: { user: { id: user.id } },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }
}
