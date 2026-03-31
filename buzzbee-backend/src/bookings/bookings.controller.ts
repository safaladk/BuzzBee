import { Controller, Get, Post, Body, UseGuards, Req, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private service: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new booking' })
  create(@Req() req, @Body() dto: CreateBookingDto) {
    return this.service.create(req.user, dto);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  getMyBookings(@Req() req) {
    return this.service.findByUser(req.user.id);
  }

  @Patch(':id/request-refund')
  @ApiOperation({ summary: 'Request a refund for a booking' })
  requestRefund(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body('reason') reason: string,
  ) {
    return this.service.requestRefund(id, req.user.id, reason);
  }

  @Get('admin/pending-refunds')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all pending refund requests' })
  getPendingRefunds() {
    return this.service.getPendingRefunds();
  }

  @Patch(':id/admin/process-refund')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Approve or reject a refund request' })
  processRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'refunded' | 'refund_rejected',
  ) {
    return this.service.processRefund(id, status);
  }
}
