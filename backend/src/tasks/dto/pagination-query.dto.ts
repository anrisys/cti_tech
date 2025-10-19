import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  take: number = 10;

  @IsOptional()
  @IsEnum(['created_at', 'title', 'status'], {
    message: 'Invalid orderBy field',
  })
  orderBy?: 'created_at' | 'title' | 'status' = 'created_at';

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}
