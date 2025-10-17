export interface SuccessResponse<T> {
    code: string;
    message: string;
    data?: T | null
}

export interface FieldError {
    field: string;
    message: string;
}

export interface ErrorResponse {
    code: string;
    message: string;
    fields?: FieldError[]
}

