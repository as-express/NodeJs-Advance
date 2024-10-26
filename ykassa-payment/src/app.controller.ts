import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { payDto } from './dto/pay.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('payment')
  @UsePipes(new ValidationPipe())
  payment(@Body() dto: payDto) {
    return this.appService.makePayment(dto)
  }
}
