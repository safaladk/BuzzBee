import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';

@ApiTags('Admin Dashboard')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private service: AdminService) {}

  @Get('events/pending')
  @ApiOperation({ summary: 'List all events awaiting verification' })
  getPendingEvents() {
    return this.service.getPendingEvents();
  }

  @Post('events/:id/verify')
  @ApiOperation({ summary: 'Approve or reject an event' })
  verifyEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'APPROVED' | 'REJECTED',
    @Body('note') rejectionNote?: string
  ) {
    return this.service.setEventStatus(id, status, rejectionNote);
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users on the platform' })
  getAllUsers() {
    return this.service.getAllUsers();
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Promote or demote a user role' })
  updateUserRole(@Param('id', ParseIntPipe) id: number, @Body('role') role: string) {
    return this.service.changeUserRole(id, role);
  }

  @Get('users/pending-verification')
  @ApiOperation({ summary: 'List all organizers awaiting account verification' })
  getPendingOrganizers() {
    return this.service.getPendingOrganizers();
  }

  @Post('users/:id/verify')
  @ApiOperation({ summary: 'Verify or reject an organizer account' })
  verifyOrganizer(
    @Param('id', ParseIntPipe) id: number,
    @Body('verify') verify: boolean
  ) {
    return this.service.verifyOrganizer(id, verify);
  }
}
