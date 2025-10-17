import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDTO, TaskStatus } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async create(task: CreateTaskDTO) {
        return this.prisma.task.create({
            data: {
                title: task.title,
                description: task.description,
                status: task.status || TaskStatus.PENDING,
            }
        });
    }

    async findAll() {
        return this.prisma.task.findMany({
            orderBy: {
                created_at: 'desc',
            }
        })
    }
}
