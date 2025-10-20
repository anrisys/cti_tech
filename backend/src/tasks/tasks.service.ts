import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { ResourceNotFoundException } from 'src/common/exceptions/custom.exception';
import { TaskStatus } from './dto/base-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { PaginationQueryDTO } from './dto/pagination-query.dto';
import { PaginationResponseDTO } from './dto/pagination-response.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(task: CreateTaskDTO) {
    return this.prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        status: task.status ? task.status : TaskStatus.PENDING,
      },
    });
  }

  async findAll(paginationQuery: PaginationQueryDTO) {
    const { skip, take, orderBy, order } = paginationQuery;

    const total = await this.prisma.task.count();

    const tasks = await this.prisma.task.findMany({
      skip: skip,
      take: take,
      orderBy: {
        [orderBy as string]: order,
      },
    });

    return new PaginationResponseDTO(tasks, total, skip, take);
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new ResourceNotFoundException('Task', id);
    }

    return task;
  }

  async updateStatus(id: number, status: TaskStatus) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async updateTask(id: number, task: UpdateTaskDTO) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
      },
    });
  }
}
