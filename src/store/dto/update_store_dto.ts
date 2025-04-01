import { IsString } from 'class-validator';
import { CreateStoreDto } from './create_store_dto';

export class UpdateStoreDto  extends CreateStoreDto{
  @IsString({
    message:"Name must be a string",
  })
  description:string
}