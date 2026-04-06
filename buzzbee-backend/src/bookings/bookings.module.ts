import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Event } from '../events/event.entity';
import { PaymentsModule } from '../payments/payments.module';
<<<<<<< Updated upstream

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Event]), PaymentsModule],
=======
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Event]),
    PaymentsModule,
    NotificationsModule,
    UsersModule,
  ],
>>>>>>> Stashed changes
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
