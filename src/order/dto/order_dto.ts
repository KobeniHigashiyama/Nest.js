import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EnumOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus,{
    message:"Status dol :"
  })
  status:EnumOrderStatus;

  @IsArray({
    message:'zero order'
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto []

}
export class OrderItemDto {
  @IsNumber({},{message:'Item t is number',})
  quantity: number;

  @IsNumber({},{message:'Item is number',})
  price:number;

  @IsString({
    message:'Id'
  })
  productId: string;

  @IsString({message:'Id is string',})
  storeId: string; 
}