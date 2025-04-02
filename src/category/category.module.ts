import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoriesController } from './category.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoryService,PrismaService],
})
export class CategoryModule {}
