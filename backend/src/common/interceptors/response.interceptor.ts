import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { SuccessResponse } from "../interfaces/response.interface";
import { map, Observable}  from 'rxjs';
import { Reflector } from "@nestjs/core";

export const RESPONSE_MESSAGE_KEY = "response_message";
export const RESPONSE_CODE_KEY = "response_code";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
    constructor(private reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
        return next.handle().pipe(
            map((data => {
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode;

                const customMessage = this.reflector.get<string>(
                    RESPONSE_MESSAGE_KEY,
                    context.getHandler()
                );

                const customCode = this.reflector.get<string>(
                    RESPONSE_CODE_KEY,
                    context.getHandler(),
                )

                let code = customCode || this.getDefaultCode(statusCode);
                let message = customMessage || this.getDefaultMessage(statusCode);

                let responseData: T | null = data;
                if (statusCode === 204 || data === undefined) {
                    responseData = null;
                }

                return {
                    code, 
                    message, 
                    data: responseData,
                }
            }))
        )
    }

    private getDefaultCode(statusCode: number): string {
        const codeMap: { [key: number]: string } = {
        200: 'SUCCESS',
        201: 'CREATED',
        202: 'ACCEPTED',
        204: 'DELETED',
        };
        return codeMap[statusCode] || 'SUCCESS';
    }

    private getDefaultMessage(statusCode: number): string {
        const messageMap: { [key: number]: string } = {
            200: 'Operation successful',
            201: 'Resource created successfully',
            202: 'Request accepted',
            204: 'Resource deleted successfully',
        };
        return messageMap[statusCode] || 'Operation successful';
    }
}