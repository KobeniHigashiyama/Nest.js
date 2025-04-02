import { IsString } from 'class-validator';

export class Category_dto{
  @IsString({
    message:"Name colour",
  })
  title:string
  @IsString({
    message:"Must",
  })
  description:string;}


