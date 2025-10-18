import { useEffect } from "react";
import type { Task, UpdateTaskRequest } from "../types/task";
import { useUpdateTask } from "../hooks/useTasks";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  updateTaskSchema,
  type UpdateTaskFormData,
} from "../schemas/task.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface UpdateTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSuccess?: () => void;
}

export function UpdateTaskForm({
  open,
  onOpenChange,
  task,
  onSuccess,
}: UpdateTaskFormProps) {
  const updateMutation = useUpdateTask();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  // Character counters
  const titleValue = watch("title") || "";
  const descriptionValue = watch("description") || "";

  // Populate form with task data when task changes or dialog opens
  useEffect(() => {
    if (task && open) {
      setValue("title", task.title);
      setValue("description", task.description || "");
    }
  }, [task, open, setValue]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: UpdateTaskFormData) => {
    if (!task) return;

    const taskData: UpdateTaskRequest = {
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      status: task.status, // Preserve the current status
    };

    updateMutation.mutate(
      { id: task.id, task: taskData },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  // Show loading state if no task is provided
  if (!task) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter task title"
              className={
                errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
              }
              disabled={updateMutation.isPending}
            />
            <div className="flex justify-between mt-1">
              {errors.title ? (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              ) : (
                <div />
              )}
              <p className="text-xs text-gray-500">{titleValue.length}/255</p>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={3}
              placeholder="Enter task description"
              className={
                errors.description
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
              disabled={updateMutation.isPending}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              ) : (
                <div />
              )}
              <p className="text-xs text-gray-500">
                {descriptionValue.length}/1000
              </p>
            </div>
          </div>

          {/* Show current status for reference */}
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Current Status:</span>{" "}
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : task.status === "in_progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {task.status.replace("_", " ").toUpperCase()}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Use the status buttons in the table to change the task status.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isValid || !isDirty}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
