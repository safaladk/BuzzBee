// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   ParseIntPipe,
//   Put,
//   Delete,
//   Request,
//   UseGuards,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// import { EventsService } from './events.service';
// import { CreateEventDto } from './dto/create-event.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @ApiTags('Events')
// @Controller('events')
// export class EventsController {
//   constructor(private service: EventsService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create new event' })
//   create(@Body() dto: CreateEventDto) {
//     return this.service.create(dto);
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Update an event' })
//   update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateEventDto) {
//     return this.service.update(id, dto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete an event' })
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.service.remove(id);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all published events' })
//   findAll() {
//     return this.service.findAll();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get published event by id' })
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.service.findOne(id);
//   }

//   @Post('sync-revenue')
//   @ApiOperation({ summary: 'Sync revenue for all events' })
//   syncRevenue() {
//     return this.service.syncRevenue();
//   }

//   @Post(':id/cancel')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Cancel an event' })
//   cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
//     const organizerId = req.user.role === 'admin' ? undefined : req.user.id;
//     return this.service.cancelEvent(id, organizerId);
//   }
// }


import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private service: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new event' })
  create(@Request() req: any, @Body() dto: CreateEventDto) {
    return this.service.create(dto, req.user);
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

  @Get()
  @ApiOperation({ summary: 'Get all published events' })
  findAll() {
    return this.service.findAll();
  }

  @Get('my-events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get organizer's events" })
  myEvents(@Request() req: any) {
    return this.service.findByOrganizer(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get published event by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post('sync-revenue')
  @ApiOperation({ summary: 'Sync revenue for all events' })
  syncRevenue() {
    return this.service.syncRevenue();
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an event' })
  cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const organizerId = req.user.role === 'admin' ? undefined : req.user.id;
    return this.service.cancelEvent(id, organizerId);
  }
}