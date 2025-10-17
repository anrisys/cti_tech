import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app.exception";

export class ValidationException extends AppException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

export class ResourceNotFoundException extends AppException {
  constructor(resourceType: string, identifier: string | number) {
    super(
      `${resourceType} with identifier ${identifier} not found`,
      HttpStatus.NOT_FOUND,
      'RESOURCE_NOT_FOUND',
    );
  }
}

export class AuthenticationException extends AppException {
  constructor(message = 'Authentication failed') {
    super(message, HttpStatus.UNAUTHORIZED, 'AUTHENTICATION_FAILED');
  }
}
