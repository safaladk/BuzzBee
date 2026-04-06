import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards, Request } from '@nestjs/common';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private service: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new event' })
  create(@Body() dto: CreateEventDto, @Request() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get('my-events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get events for current organizer' })
  findMyEvents(@Request() req: any) {
    return this.service.findByOrganizer(req.user.id);
  }

  @Get('sponsored')
  @ApiOperation({ summary: 'Get all sponsored events' })
  getSponsoredEvents() {
    return this.service.getSponsoredEvents();
  }

  @Get('admin/pending-sponsorships')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pending sponsorship requests (Admin)' })
  getPendingSponsorships(@Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.service.getPendingSponsorships();
  }

  @Get()
  @ApiOperation({ summary: 'Get all published events' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get published event by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an event' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateEventDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/request-sponsor')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request sponsorship for an event' })
  requestSponsorship(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.service.requestSponsorship(id, req.user.id);
  }

  @Put('admin/:id/sponsor-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve or reject a sponsorship request (Admin)' })
  updateSponsorshipStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'APPROVED' | 'REJECTED',
    @Request() req: any,
  ) {
    if (req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.service.updateSponsorshipStatus(id, status);
  }

  @Post('sync-revenue')
  @ApiOperation({ summary: 'Sync revenue for all events' })
  syncRevenue() {
    return this.service.syncRevenue();
  }
}
