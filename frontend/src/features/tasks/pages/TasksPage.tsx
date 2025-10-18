import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskTable } from "../components/TaskTable";
import { CreateTaskForm } from "../components/CreateTaskForm";
import { UpdateTaskForm } from "../components/UpdateTaskForm";

export function TasksPage() {
  const { data: tasks = [], isLoading, error } = useTasks();
  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);
  const [isUpdateTaskFormOpen, setIsUpdateTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsUpdateTaskFormOpen(true);
  };

  const handleUpdateSuccess = () => {
    setIsUpdateTaskFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task Management</CardTitle>
          <Button onClick={() => setIsCreateTaskFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <TaskTable tasks={tasks} onEdit={handleEditTask} />
        </CardContent>
      </Card>

      <CreateTaskForm
        open={isCreateTaskFormOpen}
        onOpenChange={setIsCreateTaskFormOpen}
      />

      <UpdateTaskForm
        open={isUpdateTaskFormOpen}
        onOpenChange={setIsUpdateTaskFormOpen}
        task={editingTask}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
