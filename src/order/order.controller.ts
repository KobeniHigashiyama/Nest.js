import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from '../auth/decorations/auth_decorator';
import { OrderDto } from './dto/order_dto';
import { CurrentUser } from '../user/decorators/user_decorators';
import { PaymentStatusDto } from './dto/payment_status_dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
@Post('place')
  @Auth()
  async checkout(@Body() dto:OrderDto,@CurrentUser('id') userId:string ) {
    return  this.orderService.createPayment(dto,userId)
  }
  @HttpCode(200)
  @Post('status')
  @Auth()
  async updateStatus(@Body() dto:PaymentStatusDto) {
    return  this.orderService.updatePayment(dto)
  }
}
