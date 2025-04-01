import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  UsePipes,
  ValidationPipe,
  Post, Put, Delete,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CurrentUser } from '../user/decorators/user_decorators';
import { Auth } from '../auth/decorations/auth_decorator';
import { CreateStoreDto } from './dto/create_store_dto';
import { UpdateStoreDto } from './dto/update_store_dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {
  }

  @Auth()
  @Get('by-id/:id')
  async getById(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string) {
    return this.storeService.getBy_id(storeId, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateStoreDto,
  ) {
    return this.storeService.create(userId, dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(":id")
  async update(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storeService.update(storeId,userId, dto)
}
@HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(
    @Param('id') storeId: string,
    @CurrentUser('id')userId: string,) {
    return this.storeService.delete(storeId, userId);
}
}
