import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ColorService } from './color.service';
import { Auth } from '../auth/decorations/auth_decorator';
import { ColorDto } from './dto/color_dto';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

@Auth()
@Get('by-storeId/:storeId')
async getByStoreId(
  @Param('id') storeId: string)
 {
  return this.colorService.getByStoreId(storeId);
}

  @Auth()
  @Get('by-id/:id')
  async getById(
    @Param('id') id: string)
  {
    return this.colorService.getBy_id(id);
  }


@UsePipes(new ValidationPipe())
@HttpCode(200)
@Auth()
@Post(':storeId')
async create(
@Param('storeId') storeId: string,
@Body() dto: ColorDto,
) {
  return this.colorService.create(storeId, dto)
}

@UsePipes(new ValidationPipe())
@HttpCode(200)
@Auth()
@Put(":id")
async update(
  @Param('id') id: string,
@Body() dto: ColorDto,
) {
  return this.colorService.update(id, dto)
}
@HttpCode(200)
@Auth()
@Delete(':id')
async delete(
@Param('id') id: string,) {
  return this.colorService.delete(id);
}
}
