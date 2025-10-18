import { api } from "@/lib/api";
import type {
  ApiResponse,
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from "../types/task";

export const taskApi = {
  getTasks: async (): Promise<ApiResponse<Task[]>> => {
    const response = await api.get("/tasks");
    return response.data;
  },

  createTask: async (task: CreateTaskRequest): Promise<ApiResponse<Task>> => {
    const response = await api.post("/tasks", task);
    return response.data;
  },

  updateTaskStatus: async (
    id: number,
    status: UpdateTaskStatusRequest
  ): Promise<ApiResponse<Task>> => {
    const response = await api.patch(`/tasks/${id}/status`, status);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  updateTask: async (
    id: number,
    task: UpdateTaskRequest
  ): Promise<ApiResponse<Task>> => {
    const response = await api.patch(`/tasks/${id}`, task);
    return response.data;
  },
};
