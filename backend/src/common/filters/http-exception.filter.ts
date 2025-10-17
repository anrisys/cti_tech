import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response, Request } from 'express';
import { ErrorResponse, FieldError } from "../interfaces/response.interface";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorResponse = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      // Class-validator error case
      if (
        typeof res === 'object' &&
        (res as any).message &&
        Array.isArray((res as any).message)
      ) {
        const fieldErrors: FieldError[] = (res as any).message.map(
          (msg: string) => ({
            field: this.extractFieldFromMessage(msg),
            message: msg,
          }),
        );

        errorResponse = {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          fields: fieldErrors,
        };
      } else if (typeof res === 'object') {
        const body = res as any;
        errorResponse = {
          code: body.errorCode || 'ERROR',
          message: body.message || 'Something went wrong',
          ...(body.details && { fields: body.details }),
        };
      } else {
        errorResponse = {
          code: 'ERROR',
          message: res as string,
        };
      }
    }

    response.status(status).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private extractFieldFromMessage(msg: string): string {
    const match = msg.match(/property (\w+)/i);
    return match ? match[1] : 'unknown';
  }
}