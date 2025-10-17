import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { ResponseCode, ResponseMessage } from 'src/common/decorators/api-response.decorator';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @ResponseMessage('Task created successfully')
    @ResponseCode('TASK_CREATED')
    create(@Body() task: CreateTaskDTO) {
        return this.tasksService.create(task);
    }

    @Get()
    @ResponseMessage('Tasks retrieved successfully')
    findAll() {
        return this.tasksService.findAll();
    }
}
