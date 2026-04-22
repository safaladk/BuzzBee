import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../events/event.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {}

  // Run every hour to check for completed events
  @Cron(CronExpression.EVERY_HOUR)
  async handleSettlementJob() {
    this.logger.log('Starting automated settlement check...');

    // Find all approved events that haven't been settled
    const unsettledEvents = await this.eventRepo.find({
      where: {
        status: 'APPROVED',
        isSettled: false,
      },
      relations: ['organizer'],
    });

    const now = new Date();
    const SETTLEMENT_BUFFER_MS = 24 * 60 * 60 * 1000; // 24 hours

    for (const event of unsettledEvents) {
      if (!event.date || !event.time) continue;

      try {
        const eventDateStr = event.date.toISOString().split('T')[0]; // "YYYY-MM-DD"
        // Safely parse time
        const timeMatch = event.time.match(/(\d+):(\d+)/);
        const hours = timeMatch ? parseInt(timeMatch[1], 10) : 0;
        const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;
        
        const eventDateTime = new Date(eventDateStr);
        eventDateTime.setHours(hours, minutes, 0, 0);

        // Check if event time + buffer is strictly in the past
        const settlementTime = new Date(eventDateTime.getTime() + SETTLEMENT_BUFFER_MS);

        if (now > settlementTime) {
          this.logger.log(`Settling event [${event.id}]: ${event.title}`);

          // Transfer funds from escrow to live revenue
          const settledAmount = Number(event.escrowRevenue || 0);
          event.revenue = Number(event.revenue || 0) + settledAmount;
          event.escrowRevenue = 0;
          event.isSettled = true;
          
          await this.eventRepo.save(event);

          if (settledAmount > 0) {
            await this.notificationsService.create(
              event.organizer,
              `Your event "${event.title}" has successfully completed and ${settledAmount} BuzzBee points have been settled to your revenue.`,
            );
          }
        }
      } catch (err) {
        this.logger.error(`Failed to settle event ${event.id}:`, err);
      }
    }

    this.logger.log('Automated settlement check complete.');
  }
}
