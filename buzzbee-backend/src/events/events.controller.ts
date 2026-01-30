import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private service: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new event' })
  create(@Body() dto: CreateEventDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published events' })
  findAll() {
    return this.service.findAll();
  }
}
