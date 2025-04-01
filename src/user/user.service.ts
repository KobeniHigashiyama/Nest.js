import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { AuthDto } from '../auth/dto/auth_dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        stores: true,
        favorites: true,
        orders: true,
      },
    });
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        stores: true,
        favorites: true,
        orders: true,
      },
    });
    return user;
  }
  async toggleFavorite(productId: string, userId: string): Promise<boolean> {
    try {
      const user = await this.getById(userId);

      // Проверяем, что пользователь найден
      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        return false;
      }

      const isExist = user.favorites?.some(
        product => product.id === productId
      ) ?? false;

      await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          favorites: {
            [isExist ? 'disconnect' : 'connect']: {
              id: productId,
            }
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }

  async create(dto: AuthDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password),
      },
    });
  }
}
