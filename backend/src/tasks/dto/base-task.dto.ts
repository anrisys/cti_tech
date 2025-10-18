import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export class BaseTaskDTO {
  @IsString()
  @IsNotEmpty({ message: 'Title should not be empty' })
  @MaxLength(255, {
    message: 'Title must be shorter than or equal to 255 characters',
  })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
