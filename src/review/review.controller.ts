import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from '../auth/decorations/auth_decorator';
import { ReviewDto } from './dto/review_dto';
import { CurrentUser } from '../user/decorators/user_decorators';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Auth()
  @Get('by-storeId:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.reviewService.getByStoreId(storeId);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':productId/:storeId')
  async create(@CurrentUser('id')userId:string,
               @Param('storeId')storeId: string,
               @Param('productId')productId: string,
               @Body() dto:ReviewDto) {
    return this.reviewService.create(storeId, dto,userId,productId);
  }
@HttpCode(200)
@Auth()
@Delete(':id')
  async delete(@Param('id') id: string,@CurrentUser('id')userId: string) {
    return this.reviewService.delete(id, userId);
}

}

