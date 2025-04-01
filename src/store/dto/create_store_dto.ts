import { IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString({
    message:"Name must be a string",
  })
  title:string
}