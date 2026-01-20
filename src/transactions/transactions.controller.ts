import { Controller, Post, Body, UseGuards, Request, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTopupDto } from './dto/create-topup.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('topup')
  async topUp(@Request() req, @Body() createTopupDto: CreateTopupDto) {
    const userId = req.user.id;
    return this.transactionsService.topUp(userId, createTopupDto);
  }
}