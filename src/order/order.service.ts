import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout';
import * as process from 'node:process';
import { OrderDto } from './dto/order_dto';
import { PaymentStatusDto } from './dto/payment_status_dto';
import { EnumOrderStatus } from '@prisma/client';

const checkout = new YooCheckout({
  shopId: process.env['YOOKASSA_SHOP_ID']!,   // Исправлено
  secretKey: process.env['YOOKASS_SECRET_KEY']! // Исправлено
});

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async createPayment(dto: OrderDto, userId: string) {
    // Формируем элементы заказа
    const orderItems = dto.items.map(item => ({
      quantity: item.quantity,
      price: item.price,
      product: {
        connect: {
          id: item.productId,
        },
      },
      store: {
        connect: {
          id: item.storeId,
        },
      },
    }));

    // Рассчитываем общую сумму заказа
    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    // Создаем запись в базе данных с помощью Prisma
    const order = await this.prismaService.order.create({
      data: {
        status: dto.status,
        items: {
          create: orderItems, // Исправлено
        },
        total,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // Создаем платеж через YooKassa
    const payment = await checkout.createPayment({
      amount: {
        value: total.toFixed(2),
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.CLIENT_URL}/thanks`,
      },
      description: `Оплата заказа №${order.id}`, // Добавлен ID заказа в описание
    });

    // Возвращаем ссылку на оплату
    return { order, payment };
  }
  async updatePayment(dto: PaymentStatusDto) {
    try {
      // Захват платежа, если требуется
      if (dto.event === 'payment.waiting_for_capture') {
        const capturePayment: ICapturePayment = {
          amount: {
            value: dto.object.amount.value,
            currency: dto.object.amount.currency,
          },
        };
        return await checkout.capturePayment(dto.object.id, capturePayment);
      }

      // Обновление статуса платежа
      if (dto.event === 'payment.succeeded') {
        const orderId = dto.object.destination.split(' ')[1];
        await this.prismaService.order.update({
          where: {
            id: orderId,
          },
          data: {
            status: EnumOrderStatus.PENDING,
          },
        });
        return true;
      }

      return true;
    } catch (error) {
      console.error('Ошибка при обновлении платежа:', error.message);
      throw new Error('Не удалось обновить статус платежа');
    }
  }

}