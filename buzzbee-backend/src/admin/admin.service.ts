import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async getPendingEvents() {
    return this.eventRepo.find({ where: { status: 'PENDING' } });
  }

  async setEventStatus(
    id: number,
    status: 'APPROVED' | 'REJECTED',
    rejectionNote?: string,
  ) {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['organizer'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    event.status = status;
    if (rejectionNote) {
      event.rejectionNote = rejectionNote;
    }

    if (status === 'APPROVED') {
      event.isPublished = true;
    }

    const savedEvent = await this.eventRepo.save(event);

    // Trigger Notifications
    if (status === 'APPROVED') {
      await this.notifyOrganizer(savedEvent, 'APPROVED');
      await this.notifyMatchingUsers(savedEvent);
    } else if (status === 'REJECTED') {
      await this.notifyOrganizer(savedEvent, 'REJECTED');
    }

    return savedEvent;
  }

  private async notifyOrganizer(event: Event, status: 'APPROVED' | 'REJECTED') {
    const message =
      status === 'APPROVED'
        ? `Your event "${event.title}" has been approved!`
        : `Your event "${event.title}" was rejected. Reason: ${event.rejectionNote}`;
    await this.notificationsService.create(event.organizer, message);
  }

  private async notifyMatchingUsers(event: Event) {
    // Find users with overlapping interests using PostgreSQL array overlap operator &&
    const users = await this.userRepo.find({
      where: [
        {
          interestedCategories: Raw(
            (alias) => `${alias} && ARRAY['${event.category}']`,
          ),
        },
        {
          interestedLocations: Raw(
            (alias) => `${alias} && ARRAY['${event.district}']`,
          ),
        },
      ],
    });

    // Exclude the organizer from recommendations
    const attendees = users.filter((u) => u.id !== event.organizer.id);

    const message = `Recommended for you: "${event.title}" matches your interests in ${event.category}!`;

    // Create notifications in parallel
    await Promise.all(
      attendees.map((user) => this.notificationsService.create(user, message)),
    );
  }

  async getAllUsers() {
    return this.userRepo.find({
      select: ['id', 'fullName', 'email', 'role', 'createdAt'],
    });
  }

  async changeUserRole(id: number, role: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    return this.userRepo.save(user);
  }

  async getPendingOrganizers() {
    return this.userRepo.find({
      where: { 
        isVerified: false, 
        role: 'organizer',
      },
    });
  }

  async verifyOrganizer(id: number, verify: boolean) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isVerified = verify;
    return this.userRepo.save(user);
  }
}
