import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import {
  ResponseCode,
  ResponseMessage,
} from 'src/common/decorators/api-response.decorator';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

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
    @Body() newTaskStatus: UpdateTaskStatusDTO,
  ) {
    return this.tasksService.updateStatus(id, newTaskStatus.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('Task deleted successfully')
  @ResponseCode('TASK_DELETED')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }

  @Put(':id')
  @ResponseCode('TASK_UPDATED')
  @ResponseMessage('Task updated successfully')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDTO,
  ) {
    return this.tasksService.updateTask(id, task);
  }
}
