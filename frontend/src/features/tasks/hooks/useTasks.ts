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
  ApiResponse,
  Task,
  PaginationParams,
} from "../types/task";
import { taskApi } from "../api/taskApi";
import { toast } from "sonner";
import type { ApiError } from "@/common/types/error";
import { showApiError } from "@/common/util/error-utils";

export const useTasks = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => taskApi.getTasks(params),
    placeholderData: (previousData) => previousData,
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
    onError: (error: ApiError) => showApiError(error, "create new task"),
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
    onError: (error: ApiError) => showApiError(error, "update task status"),
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
    onError: (error: ApiError) => showApiError(error, "update task"),
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
    onError: (error: ApiError) => showApiError(error, "delete task"),
  });
};
