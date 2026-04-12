import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateSponsorshipIntentDto } from './dto/create-sponsorship-intent.dto';
import { VerifySponsorshipDto } from './dto/verify-sponsorship.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Create Stripe payment intent for booking checkout' })
  createIntent(@Req() req, @Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createPaymentIntent(req.user, dto);
  }

  @Post('create-sponsorship-intent')
  @ApiOperation({ summary: 'Create Stripe payment intent for event sponsorship boost' })
  createSponsorshipIntent(@Req() req, @Body() dto: CreateSponsorshipIntentDto) {
    return this.paymentsService.createSponsorshipIntent(req.user, dto);
  }

  @Post('verify-sponsorship')
  @ApiOperation({ summary: 'Verify completed sponsorship payment and apply boost' })
  verifySponsorship(@Req() req, @Body() dto: VerifySponsorshipDto) {
    return this.paymentsService.verifySucceededSponsorshipIntent({
      paymentIntentId: dto.paymentIntentId,
      eventId: dto.eventId,
      userId: req.user.id,
    });
  }
}
