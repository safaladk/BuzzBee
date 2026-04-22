import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { Booking } from '../bookings/booking.entity';
import { SettlementService } from './settlement.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Booking]),
    NotificationsModule,
    UsersModule,
  ],
  providers: [SettlementService],
})
export class JobsModule {}
