import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type {
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  UpdateTaskRequest,
  ApiError,
  ApiResponse,
  Task,
} from "../types/task";
import { taskApi } from "../api/taskApi";
import { toast } from "sonner";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await taskApi.getTasks();
      return response.data || [];
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: CreateTaskRequest) => taskApi.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.message || "Failed to create task";
      toast.error(errorMessage);

      if (error.fields && error.fields.length > 0) {
        error.fields.forEach((fieldError) => {
          toast.error(`${fieldError.field}: ${fieldError.message}`);
        });
      }
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: UpdateTaskStatusRequest;
    }) => taskApi.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task status updated");
    },
    onError: (error: any) => {
      toast.error("Failed to update task status");
    },
  });
};

export const useUpdateTask = (): UseMutationResult<
  ApiResponse<Task>,
  ApiError,
  { id: number; task: UpdateTaskRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: UpdateTaskRequest }) =>
      taskApi.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
    },
    onError: (error: ApiError) => {
      const errorMessage = error.message || "Failed to update task";
      toast.error(errorMessage);

      if (error.fields && error.fields.length > 0) {
        error.fields.forEach((fieldError) => {
          toast.error(`${fieldError.field}: ${fieldError.message}`);
        });
      }
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to delete task");
    },
  });
};
