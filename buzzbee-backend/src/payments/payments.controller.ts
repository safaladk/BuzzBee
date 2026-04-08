import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateSponsorshipIntentDto } from './dto/create-sponsorship-intent.dto';

interface RequestWithUser {
  user: any;
}

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  @ApiOperation({
    summary: 'Create Stripe payment intent for booking checkout',
  })
  createIntent(@Req() req, @Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createPaymentIntent(req.user, dto);
  }

  @Post('create-sponsorship-intent')
  @ApiOperation({ summary: 'Create Stripe payment intent for event boosting' })
  createSponsorshipIntent(@Req() req, @Body() dto: CreateSponsorshipIntentDto) {
    return this.paymentsService.createSponsorshipIntent(req.user, dto);
  }

  @Post('verify-sponsorship')
  @ApiOperation({
    summary: 'Verify successful sponsorship payment and activate boost',
  })
  async verifySponsorship(
    @Req() req,
    @Body('paymentIntentId') paymentIntentId: string,
    @Body('eventId') eventId: number,
  ) {
    const verification =
      await this.paymentsService.verifySucceededSponsorshipIntent({
        paymentIntentId,
        eventId,
        userId: req.user.id,
      });

    if (verification.success) {
      await this.paymentsService.autoBoostEvent(eventId, verification.days);
    }

    return verification;
  }
}
