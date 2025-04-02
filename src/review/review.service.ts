import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from 'rxjs';
import { ReviewDto } from './dto/review_dto';
import { ProductService } from '../product/product.service';


@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService,
              private productService: ProductService,) {}

  async  getByStoreId(storeId:string){
    return this.prisma.review.findMany({
      where:{
        storeId
      },
      include:{
        user:true
      }
    })
  }
  async getBy_id(id:string,userId:string){
    const review =  await this.prisma.review.findUnique({
      where:{
        id,
        userId
      },
      include:{
        user:true
      }
    })
    if(!review) throw new  NotFoundError('No review');
    return review;
  }
  async create(storeId:string,
               dto:ReviewDto,
               userId:string,
               productId:string,){
    await this.productService.getBy_id(productId);
  return this.prisma.review.create({
    data:{
      ...dto,
      product:{
        connect:{
          id:productId,
        }
      },
      user:{
        connect:{
          id:userId
        }
      },
      store:{
        connect:{
          id:storeId,
        }
      }
    }

  })}
  async delete(id:string,userId:string){
    await this.getBy_id(id,userId)
    return this.prisma.review.delete({
      where:{
        id
      }
    })
  }
}
