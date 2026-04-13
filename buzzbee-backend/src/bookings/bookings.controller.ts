import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

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
  @ApiOperation({ summary: 'Request refund for a booking' })
  requestRefund(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason: string },
  ) {
    return this.service.requestRefund(id, req.user.id, body.reason);
  }

  @Get('admin/pending-refunds')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all pending refund requests (admin)' })
  getPendingRefunds() {
    return this.service.getPendingRefunds();
  }

  @Patch(':id/admin/process-refund')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Approve or reject refund request (admin)' })
  processRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: 'refunded' | 'refund_rejected' },
  ) {
    return this.service.processRefund(id, body.status);
  }
}
