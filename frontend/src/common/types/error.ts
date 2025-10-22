export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  fields?: Array<{
    field: string;
    message: string;
  }>;
}
