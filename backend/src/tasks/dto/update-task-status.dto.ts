import { IsEnum } from 'class-validator';
import { TaskStatus } from './base-task.dto';

export class UpdateTaskStatusDTO {
  @IsEnum(TaskStatus, {
    message: 'status must be one of: pending, in_progress, done',
  })
  status: TaskStatus;
}
