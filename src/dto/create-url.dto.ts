import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsString()
  originalUrl: string;

  @IsOptional()
  userId?: number;
}
