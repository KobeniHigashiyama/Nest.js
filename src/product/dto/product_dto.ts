import { ArrayMinSize, IsNotEmpty, IsString } from 'class-validator';

export class ProductDto {
  @IsString({
    message:"Name must be a string",
  })
  @IsNotEmpty({
    message:"Name is required",
  })
  title:string

  @IsString({message:"Must be a string",})
  @IsNotEmpty({message:"Price is required",})
  description:string

  @IsString( {message:"Must be a number",})
  @IsNotEmpty({message:"Price is required",})
  price:number


  @IsString({message:"Must be a number",
  each: true })

  @ArrayMinSize(1,{message:'Must be one picture'})
  @IsNotEmpty({
    each: true,
    message:"Must be not empty",
  })
  images:string[]

  @IsString({message:"Ctegory",})
  @IsNotEmpty({message:"Ctegory is required",})
  categoryId:string


  @IsString({message:"Color colour",})
  @IsNotEmpty({message:"Color is required",})
  colorId:string



}
