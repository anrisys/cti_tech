import { INestApplication } from "@nestjs/common";
import { app, prisma } from "./setup";
import request from "supertest";
import { CreateTaskDTO, TaskStatus } from "src/tasks/dto/create-task.dto";

describe('TaskController (e2e)', () => {
    let testApp: INestApplication;

    beforeAll(() => {
        testApp = app;
    })

    describe('POST /tasks', () => {
        it('should create a task successfully', async () => {
            const newTask: CreateTaskDTO = {
                title: "Task test",
                description: "Description test"
            };

            const response = await request(testApp.getHttpServer())
                .post('/tasks')
                .send(newTask)
                .expect(201);

            expect(response.body).toEqual({
                code: 'TASK_CREATED',
                message: "Task created successfully",
                data: {
                    id: expect.any(Number),
                    title: newTask.title,
                    description: newTask.description,
                    status: "pending",
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                }
            })
        })

        it('should return validation error for empty title', async () => {
            const response = await request(testApp.getHttpServer())
                .post('/tasks')
                .send({
                title: '',
                description: 'Test Description',
                })
                .expect(400);

            expect(response.body).toEqual({
                code: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                fields: expect.arrayContaining([
                expect.objectContaining({
                    field: 'title',
                    message: expect.any(String),
                }),
                ]),
            });
        });

        it('should return validation error for missing title', async () => {
            const response = await request(testApp.getHttpServer())
                .post('/tasks')
                .send({
                description: 'Test Description',
                })
                .expect(400);

            expect(response.body).toEqual({
                code: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                fields: expect.arrayContaining([
                expect.objectContaining({
                    field: 'title',
                    message: expect.any(String),
                }),
                ]),
            });
        });
    })

    describe('GET /tasks', () => {
    beforeEach(async () => {
      // Setup test data
      await prisma.task.createMany({
        data: [
          {
            title: 'First Task',
            description: 'First Description',
            status: TaskStatus.PENDING,
          },
          {
            title: 'Second Task',
            description: 'Second Description',
            status: TaskStatus.IN_PROGRESS,
          },
        ],
      });
    });

    it('should return all tasks', async () => {
      const response = await request(testApp.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual({
        code: 'SUCCESS',
        message: 'Tasks retrieved successfully',
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: 'First Task',
            description: 'First Description',
            status: 'pending',
          }),
          expect.objectContaining({
            id: expect.any(Number),
            title: 'Second Task',
            description: 'Second Description',
            status: 'in_progress',
          }),
        ]),
      });

      expect(response.body.data[0].title).toBe('First Task');
      expect(response.body.data[1].title).toBe('Second Task');
    });

    it('should return empty array when no tasks', async () => {
      await prisma.task.deleteMany(); 

      const response = await request(testApp.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual({
        code: 'SUCCESS',
        message: 'Tasks retrieved successfully',
        data: [],
      });
    });
    });

    describe('PATCH /tasks/:id/status', () => {
        let taskId: number;

        beforeEach(async () => {
        const task = await prisma.task.create({
            data: {
            title: 'Test Task',
            description: 'Test Description',
            status: TaskStatus.PENDING,
            },
        });
        taskId = task.id;
        });

        it('should update task status successfully', async () => {
        const response = await request(testApp.getHttpServer())
            .patch(`/tasks/${taskId}/status`)
            .send({ status: TaskStatus.IN_PROGRESS })
            .expect(200);

        expect(response.body).toEqual({
            code: 'TASK_UPDATED',
            message: 'Task status updated successfully',
            data: {
            id: taskId,
            title: 'Test Task',
            description: 'Test Description',
            status: 'in_progress',
            created_at: expect.any(String),
            updated_at: expect.any(String),
            },
        });

        // Verify new saved data in the database
        const updatedTask = await prisma.task.findUnique({
            where: { id: taskId },
        });
        expect(updatedTask?.status).toBe('in_progress');
        });

        it('should return 404 for non-existent task', async () => {
        const response = await request(testApp.getHttpServer())
            .patch('/tasks/9999/status')
            .send({ status: TaskStatus.IN_PROGRESS })
            .expect(404);

        expect(response.body).toEqual({
            code: 'RESOURCE_NOT_FOUND',
            message: 'Task with identifier 9999 not found',
        });
        });

        it('should return validation error for invalid status', async () => {
        const response = await request(testApp.getHttpServer())
            .patch(`/tasks/${taskId}/status`)
            .send({ status: 'invalid_status' })
            .expect(400);

        expect(response.body.code).toBe('VALIDATION_ERROR');
        });
    });

    describe('DELETE /tasks/:id', () => {
        let taskId: number;

        beforeEach(async () => {
        const task = await prisma.task.create({
            data: {
            title: 'Task to delete',
            description: 'Will be deleted',
            status: TaskStatus.PENDING,
            },
        });
        taskId = task.id;
        });

        it('should delete task successfully', async () => {
        await request(testApp.getHttpServer())
            .delete(`/tasks/${taskId}`)
            .expect(204);

        // Verify task is deleted
        const deletedTask = await prisma.task.findUnique({
            where: { id: taskId },
        });
        expect(deletedTask).toBeNull();
        });

        it('should return 404 for non-existent task', async () => {
        const response = await request(testApp.getHttpServer())
            .delete('/tasks/9999')
            .expect(404);

        expect(response.body).toEqual({
            code: 'RESOURCE_NOT_FOUND',
            message: 'Task with identifier 9999 not found',
        });
        });
    });

    describe('Task Status Flow', () => {
        it('should follow the correct status progression', async () => {
        const createResponse = await request(testApp.getHttpServer())
            .post('/tasks')
            .send({ title: 'Flow Test Task' })
            .expect(201);

        const taskId = createResponse.body.data.id;
        expect(createResponse.body.data.status).toBe('pending');

        const updateResponse = await request(testApp.getHttpServer())
            .patch(`/tasks/${taskId}/status`)
            .send({ status: TaskStatus.IN_PROGRESS })
            .expect(200);

        expect(updateResponse.body.data.status).toBe('in_progress');

        const doneResponse = await request(testApp.getHttpServer())
            .patch(`/tasks/${taskId}/status`)
            .send({ status: TaskStatus.DONE })
            .expect(200);

        expect(doneResponse.body.data.status).toBe('done');
        });
    });
})