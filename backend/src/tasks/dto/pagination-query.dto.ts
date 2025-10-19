import { IsOptional, IsNumber, Min, IsEnum, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
export enum OrderByField {
  CREATED_AT = 'created_at',
  TITLE = 'title',
  STATUS = 'status',
}

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
  @IsEnum(OrderByField, { message: 'Invalid orderBy field' })
  orderBy?: 'created_at' | 'title' | 'status' = 'created_at';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
