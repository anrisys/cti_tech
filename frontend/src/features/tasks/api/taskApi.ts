import { api } from "@/lib/api";
import type {
  ApiResponse,
  CreateTaskRequest,
  PaginatedResponse,
  PaginationParams,
  Task,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from "../types/task";
import { handleApiCall } from "@/common/util/api-utils";
export const taskApi = {
  getTasks: async (
    params: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Task>>> => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/tasks?${queryParams}`);
    return response.data;
  },

  createTask: async (task: CreateTaskRequest) =>
    handleApiCall(() => api.post("/tasks", task).then((r) => r.data)),

  updateTaskStatus: async (id: number, status: UpdateTaskStatusRequest) => {
    const apiCall = async () => {
      const response = await api.patch(`/tasks/${id}/status`, status);
      return response.data;
    };
    handleApiCall(apiCall);
  },

  deleteTask: async (id: number): Promise<void> => {
    const apiCall = async () => {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    };
    handleApiCall(apiCall);
  },

  updateTask: async (id: number, task: UpdateTaskRequest) =>
    handleApiCall(() => api.put(`/tasks/${id}`, task).then((r) => r.data)),
};
