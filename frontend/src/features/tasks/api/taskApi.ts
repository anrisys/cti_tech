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
    try {
      const response = await api.post("/tasks", task);
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      throw {
        message: errorData?.message || "Failed to create task",
        code: errorData?.code,
        fields: errorData?.fields,
      };
    }
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
    try {
      const response = await api.put(`/tasks/${id}`, task);
      return response.data;
    } catch (error: any) {
      console.error("Update task error:", error);

      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message || error.message || "Failed to update task";

      throw {
        message: errorMessage,
        code: errorData?.code || "UPDATE_ERROR",
        fields: errorData?.fields,
      };
    }
  },
};
