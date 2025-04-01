import { IsString } from 'class-validator';

export class ColorDto {
  @IsString({
    message:"Name colour",
  })
  name:string
  @IsString({
    message:"Must",
  })
  value:string;




 }