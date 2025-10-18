import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const createTaskSchema = taskSchema;
export const updateTaskSchema = taskSchema;

export type CreateTaskFormData = TaskFormData;
export type UpdateTaskFormData = TaskFormData;
