import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from 'rxjs';

import { ColorDto } from './dto/color_dto';


@Injectable()
export class ColorService {
  constructor (private prisma: PrismaService) {}
  async  getByStoreId(storeId:string){
    return this.prisma.color.findMany({
      where:{
        storeId
      }
    })
  }
  async getBy_id(id:string){
    const color =  await this.prisma.color.findUnique({
      where:{
        id
      }
    })
    if(!color) throw new  NotFoundError('No color found');
    return color;
  }
  async create(storeId:string,dto:ColorDto){
    return this.prisma.color.create({
      data:{
         name:dto.name,
        value:dto.value,
        storeId
      }
    })
  }

  async update(id:string,dto:ColorDto){
    await  this.getBy_id(id);
    return this.prisma.color.update({
      where:{ id },
      data:{
        ...dto,
      }
    })
  }
  async delete(id:string){
    await this.getBy_id(id);
    return this.prisma.color.delete({
      where:{
        id,
      }
    })
  }

}
