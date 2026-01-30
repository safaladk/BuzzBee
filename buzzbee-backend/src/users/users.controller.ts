import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class UsersController {
  constructor(private service: UsersService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  signup(@Body() dto: SignupDto) {
    return this.service.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req) {
    return req.user;
  }
}
