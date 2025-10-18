import { IsEnum, IsOptional } from 'class-validator';
import { BaseTaskDTO, TaskStatus } from './base-task.dto';

export class UpdateTaskDTO extends BaseTaskDTO {
  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}
