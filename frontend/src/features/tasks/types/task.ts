export type TaskStatus = "pending" | "in_progress" | "done";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data?: T;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface ApiError {
  message: string;
  code?: string;
  fields?: Array<{ field: string; message: string }>;
}
