// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse, FieldError } from '../interfaces/response.interface';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('Exception instance of HttpException:', exception instanceof HttpException);
    console.log('Exception instance of AppException:', exception instanceof AppException);
    
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

      // Handle AppException
      if (exception instanceof AppException) {
        errorResponse = this.handleAppException(exception, res);
      }
      // Handle class-validator BadRequestException
      else if (exception instanceof BadRequestException) {
        errorResponse = this.handleBadRequestException(res);
      }
      // Handle other HttpExceptions
      else {
        errorResponse = this.handleGenericHttpException(res);
      }
    }

    response.status(status).json({
      ...errorResponse,
    });
  }

  private handleAppException(exception: AppException, res: any): ErrorResponse {
    return {
      code: exception.errorCode || 'ERROR',
      message: exception.message,
      ...(exception.details && { fields: exception.details }),
    };
  }

private handleBadRequestException(res: any): ErrorResponse {
  console.log('BadRequestException structure:', JSON.stringify(res, null, 2));
  
  let fieldErrors: FieldError[] = [];

  // For custom validation
  if (typeof res === 'object' && res.errors && Array.isArray(res.errors)) {
    fieldErrors = res.errors.map((error: any) => ({
      field: error.field,
      message: this.formatFieldMessage(error.field, error.message),
    }));
  }
  // Checking for error from class validator
  else if (typeof res === 'object' && res.message && Array.isArray(res.message)) {
    res.message.forEach((error: any) => {
      if (error.constraints) {
        Object.values(error.constraints).forEach((constraint: string) => {
          fieldErrors.push({
            field: error.property,
            message: constraint.includes('isEnum') 
              ? 'Status must be one of: pending, in_progress, done'
              : constraint,
          });
        });
      }
    });
  }

  if (fieldErrors.length > 0) {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Invalid input data',
      fields: fieldErrors,
    };
  }

  return {
    code: 'BAD_REQUEST',
    message: typeof res === 'string' ? res : res.message || 'Bad request',
  };
}

private formatFieldMessage(field: string, message: string): string {
  if (field === 'status' && message.includes('enum')) {
    return 'Status must be one of: pending, in_progress, done';
  }
  return message;
}

  private handleGenericHttpException(res: any): ErrorResponse {
    if (typeof res === 'object') {
      return {
        code: res.errorCode || 'ERROR',
        message: res.message || 'Something went wrong',
      };
    } else {
      return {
        code: 'ERROR',
        message: res as string,
      };
    }
  }

  private getUserFriendlyMessage(error: any): string {
    if (error.constraints) {
      const constraints = Object.values(error.constraints) as string[];
      
      // Handle enum validation specifically
      if (constraints.some(c => c.includes('isEnum'))) {
        return `Status must be one of: pending, in_progress, done`;
      }
      
      // Return the first constraint message
      return constraints[0];
    }
    
    return 'Invalid value';
  }
}