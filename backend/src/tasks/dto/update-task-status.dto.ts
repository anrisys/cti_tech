import { IsEnum } from "class-validator";
import { TaskStatus } from "./create-task.dto";

export class UpdateTaskStatuskDTO {
    @IsEnum(TaskStatus, { 
        message: 'status must be one of: pending, in_progress, done' 
    })
    status: TaskStatus;
}