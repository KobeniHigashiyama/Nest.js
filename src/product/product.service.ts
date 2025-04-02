import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from 'rxjs';
import { ProductDto } from './dto/product_dto';


@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(searchTerm?:string) {
    if(searchTerm) return this.getSearcTermFilter(searchTerm);
      return   this.prisma.product.findMany({
      orderBy:{
        createdAt:'desc'
      },
      include:{
        category:true,

      }
    })
  }
  private async getSearcTermFilter(searchTerm:string){
    return  this.prisma.product.findMany({
      where:{OR:[
        {
          title:{
            contains:searchTerm,
            mode: 'insensitive'
          },
          description:{
            contains:searchTerm,
            mode: 'insensitive'
          }
        }
      ]}
    })
  }
  async  getByStoreId(storeId:string){
    return this.prisma.product.findMany({
      where:{
        storeId
      },
      include:{
        category:true,
        color:true
      }
    })
  }
  async getBy_id(id:string){
    const product =  await this.prisma.product.findUnique({
      where:{
        id
      },
      include:{
        category:true,
        color:true,
        reviews:true
      }
    })
    if(!product) throw new  NotFoundError('No product found');
    return product;
  }

  async getBy_category(categoryId:string){
    const products =  await this.prisma.product.findMany({
      where:{
          category:{
          id:categoryId
        }
      },
      include:{
        category:true,

      }
    })
    if(!products) throw new  NotFoundError('No productsss found');
    return products;
  }

  async  getMostPopular() {
    const mostPopular  = await this.prisma.orderItem.groupBy({
      by:['productId'],
      _count:{
        id:true
      },
      orderBy:{
        _count:{
          id:'desc'
        }
      }
    })
    const productIds =mostPopular.map(item=>productIds)
    const products = await this.prisma.product.findMany({
      where:{
        id:{
          in:productIds
        }
      },
      include:{
        category:true,
      }
    })
    return products;
  }
  async getSimilar(id: string) {
    const currentProduct = await this.getBy_id(id);
    if (!currentProduct) throw new NotFoundError('No current product found');

    const products = await this.prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId, // Используем categoryId напрямую
        NOT: {
          id: currentProduct.id, // Исключаем текущий продукт
        },
      },
      orderBy: {
        createdAt: 'desc', // Сортировка по дате создания
      },
      include: {
        category: true, // Включаем данные категории
      },
    });

    return products;
  }
  async create(storeId:string,dto:ProductDto) {
    return this.prisma.product.create({
      data:{
        title:dto.title,
        description:dto.description,
        price:dto.price,
        images: dto.images,
        categoryId:dto.categoryId,
        colorId:dto.colorId,
        storeId
      }
    })
  }

  async update(id:string,dto:ProductDto){
    await  this.getBy_id(id);
    return this.prisma.product.update({
      where:{ id },
      data:{
        ...dto,
      }
    })
  }
  async delete(id:string){
    await this.getBy_id(id);
    return this.prisma.product.delete({
      where:{
        id,
      }
    })
  }


}

