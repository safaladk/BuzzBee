import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { Booking } from '../bookings/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, Booking])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
