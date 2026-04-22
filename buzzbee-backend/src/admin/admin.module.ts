import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, User]),
    NotificationsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
