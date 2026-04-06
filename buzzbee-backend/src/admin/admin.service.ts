import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getPendingEvents() {
    return this.eventRepo.find({ where: { status: 'PENDING' } });
  }

  async setEventStatus(
    id: number,
    status: 'APPROVED' | 'REJECTED',
    rejectionNote?: string,
  ) {
    const event = await this.eventRepo.findOne({ where: { id } });
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

    return this.eventRepo.save(event);
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
        verificationDocs: Not(IsNull()),
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
