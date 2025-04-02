import { IsNotEmpty, IsNumber, IsString ,Max,Min} from 'class-validator';

export class ReviewDto {
  @IsString({
    message:'Text must be string'
  })
  @IsNotEmpty({
    message:'Text  must be full'
  })
  text:string

  @IsNumber({},{message:'Must be number'})
  @Min(1,{message:'Min 1'})
  @Max(5,{message:'Max 5'})
  @IsNotEmpty({message:'Max should be number'})
  rating:number
}