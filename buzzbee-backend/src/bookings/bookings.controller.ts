import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
}
