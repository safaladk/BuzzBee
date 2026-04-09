import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User])],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
