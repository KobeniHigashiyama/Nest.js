import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorations/auth_decorator';
import { CurrentUser } from './decorators/user_decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Auth()
  @Get('profile')
  async  getProfile(@CurrentUser('id') id:string){
    return this.userService.getById(id)
  }
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorites(
    @CurrentUser('id')userId:string,
    @Param('productId') productId:string){
    return this.userService.toggleFavorite(productId,userId)
  }
}
