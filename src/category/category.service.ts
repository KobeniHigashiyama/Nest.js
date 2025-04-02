import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from 'rxjs';

import {Category_dto} from './dto/category_dto';


@Injectable()
export class CategoryService {
  constructor (private prisma: PrismaService) {}
  async  getByStoreId(storeId:string){
    return this.prisma.category.findMany({
      where:{
        storeId
      }
    })
  }
  async getBy_id(id:string){
    const category =  await this.prisma.category.findUnique({
      where:{
        id
      }
    })
    if(!category) throw new  NotFoundError('No category found');
    return category;
  }
  async create(storeId:string,dto:Category_dto){
    return this.prisma.category.create({
      data:{
        title:dto.title,
        description:dto.description,
        storeId
      }
    })
  }

  async update(id:string,dto:Category_dto){
    await  this.getBy_id(id);
    return this.prisma.category .update({
      where:{ id },
      data:{
        ...dto,
      }
    })
  }
  async delete(id:string){
    await this.getBy_id(id);
    return this.prisma.category.delete({
      where:{
        id,
      }
    })
  }

}