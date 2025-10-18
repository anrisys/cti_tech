import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { HttpExceptionFilter } from "src/common/filters/http-exception.filter";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";

import { PrismaService } from "src/prisma/prisma.service";

let app: INestApplication;
let prisma: PrismaService;

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ResponseInterceptor(reflector));
    console.log('ResponseInterceptor applied');
    
    app.useGlobalFilters(new HttpExceptionFilter());
    console.log('HttpExceptionFilter applied');
    
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            console.log('Validation errors:', errors);
            const formattedErrors = errors.map(error => ({
                field: error.property,
                message: Object.values(error.constraints || {}).join(', '),
            }));
            return new BadRequestException({
                message: 'Validation failed',
                errors: formattedErrors,
            });
        },
    }));

    await app.init();

    prisma = app.get(PrismaService);
    await prisma.task.deleteMany();
})

beforeEach(async () => {
    await prisma.task.deleteMany();
});

afterAll(async () => {
    await app.close();
});

export {app, prisma};