import { IsEnum, IsOptional } from 'class-validator';
import { BaseTaskDTO, TaskStatus } from './base-task.dto';

export class CreateTaskDTO extends BaseTaskDTO {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: string;
}
