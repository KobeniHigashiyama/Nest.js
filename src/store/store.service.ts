import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from 'rxjs';
import { CreateStoreDto } from './dto/create_store_dto';
import { UpdateStoreDto } from './dto/update_store_dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) { }
  async getBy_id(store_id:string,userId:string){
    const store =  await this.prisma.store.findUnique({
      where:{
        id: store_id,userId
      }
    })
    if(!store) throw new  NotFoundError('No store found');
    return store;
  }
   async create(userId:string,dto:CreateStoreDto){
    return this.prisma.store.create({
      data:{
        title:dto.title, userId
      }
    })
   }
  async update(storeId:string,userId:string,dto:UpdateStoreDto){
    await  this.getBy_id(storeId,userId);
    return this.prisma.store.update({
      where:{
        id: storeId,
      },
      data:{
        title:dto.title, userId,
        description:dto.description,
      }
    })
  }
  async delete(userId:string,storeId:string){
    await this.getBy_id(storeId,userId);
    return this.prisma.store.delete({
      where:{
        id: storeId,
      }
    })
  }
}
