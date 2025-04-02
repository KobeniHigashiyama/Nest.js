import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UsePipes,Put, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';

import { Auth } from '../auth/decorations/auth_decorator';
import { ProductDto } from './dto/product_dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query('searchTerm') searchTerm?:string) {
    return this.productService.getAllProducts(searchTerm);
  }
  @Auth()
  @Get('by-storeId:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.productService.getByStoreId(storeId);
  }
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.productService.getBy_id(id)
  }
@Get('by-category:categoryId')
  async getByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getBy_category(categoryId);
}
@Get('most-populer')
  async getMostPopular(){
    return this.productService.getMostPopular();
}
@Get('simular/:id')
  async getSimular(@Param('id') id: string) {
    return this.productService.getSimilar(id)
}
@UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async create(@Param('storeId')storeId: string, @Body() dto: ProductDto) {
    return this.productService.create(storeId, dto)
}
@UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
@Put(':id')
  async update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(id, dto)

}
@UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete(':id')
async delete(@Param('id') id: string) {
  return this.productService.delete(id)}
}