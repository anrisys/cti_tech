import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteTask, useUpdateTaskStatus } from "../hooks/useTasks";
import type { Task } from "../types/task";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit, Trash2 } from "lucide-react";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const statusOrder: Record<string, string> = {
  pending: "in_progress",
  in_progress: "done",
  done: "pending",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

export function TaskTable({ tasks, onEdit }: TaskTableProps) {
  const updateStatusMutation = useUpdateTaskStatus();
  const deleteMutation = useDeleteTask();

  const handleStatusUpdate = (task: Task) => {
    const nextStatus = statusOrder[task.status];
    if (nextStatus) {
      updateStatusMutation.mutate({
        id: task.id,
        status: { status: nextStatus as any },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.description || "-"}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : task.status === "in_progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {statusLabels[task.status]}
              </span>
            </TableCell>
            <TableCell>
              {new Date(task.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(task)}
                  disabled={updateStatusMutation.isPending}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
