import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO, TaskStatus } from './dto/create-task.dto';
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

    @Patch(':id/status')
    @ResponseMessage('Task status updated successfully')
    @ResponseCode('TASK_UPDATED')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: TaskStatus,
    ) {
        return this.tasksService.updateStatus(id, status);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ResponseMessage('Task deleted successfully')
    @ResponseCode('TASK_DELETED')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.remove(id);
    }
}
