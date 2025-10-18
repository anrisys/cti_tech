import { useEffect, useState } from "react";
import type { Task, UpdateTaskRequest } from "../types/task";
import { useUpdateTask } from "../hooks/useTasks";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const updateMutation = useUpdateTask();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) return;

    const taskData: UpdateTaskRequest = {
      title,
      description: description || undefined,
    };

    updateMutation.mutate(
      { id: task.id, task: taskData },
      {
        onSuccess: () => {
          onOpenChange(false);
          setTitle("");
          setDescription("");
          onSuccess?.();
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTitle("");
      setDescription("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title"
              disabled={updateMutation.isPending}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Enter task description"
              disabled={updateMutation.isPending}
            />
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
              disabled={updateMutation.isPending || !title.trim()}
            >
              {updateMutation.isPending ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
