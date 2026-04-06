import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  findAll(@Request() req: { user: { id: number } }) {
    return this.service.findByUser(req.user.id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markRead(@Request() req: { user: { id: number } }, @Param('id') id: string) {
    return this.service.markAsRead(Number(id), req.user.id);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@Request() req: { user: { id: number } }) {
    return this.service.markAllAsRead(req.user.id);
  }
}
