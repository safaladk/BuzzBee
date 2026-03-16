import { Controller, Post, Delete, Get, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly service: FavoritesService) {}

  @Post(':eventId')
  @ApiOperation({ summary: 'Add an event to favorites' })
  addFavorite(@Request() req: any, @Param('eventId', ParseIntPipe) eventId: number) {
    return this.service.addFavorite(req.user, eventId);
  }

  @Delete(':eventId')
  @ApiOperation({ summary: 'Remove an event from favorites' })
  removeFavorite(@Request() req: any, @Param('eventId', ParseIntPipe) eventId: number) {
    return this.service.removeFavorite(req.user, eventId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all favorite events for the current user' })
  getFavorites(@Request() req: any) {
    return this.service.getUserFavorites(req.user);
  }
}
