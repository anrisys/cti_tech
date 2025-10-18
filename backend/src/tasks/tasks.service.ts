import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDTO, TaskStatus } from './dto/create-task.dto';
import { ResourceNotFoundException } from 'src/common/exceptions/custom.exception';

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

    async findOne(id: number) {
        const task = await this.prisma.task.findUnique({
            where: {id},
        });

        if (!task) {
            throw new ResourceNotFoundException('Task', id);
        }

        return task;
    }

    async updateStatus(id: number, status: TaskStatus) {
        await this.findOne(id);

        return this.prisma.task.update({
            where: {id},
            data: {status}
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.task.delete({
            where: {id}
        })
    }
}
