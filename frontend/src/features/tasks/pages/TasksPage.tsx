import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskTable } from "../components/TaskTable";
import { Pagination } from "../components/Pagination";
import { CreateTaskForm } from "../components/CreateTaskForm";
import { UpdateTaskForm } from "../components/UpdateTaskForm";

export function TasksPage() {
  const [paginationParams, setPaginationParams] = useState({
    skip: 0,
    take: 10,
    orderBy: "created_at" as const,
    order: "desc" as const,
  });

  const { data, isLoading, error } = useTasks(paginationParams);
  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);
  const [isUpdateTaskFormOpen, setIsUpdateTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Calculate current page based on skip and take
  const currentPage =
    Math.floor(paginationParams.skip / paginationParams.take) + 1;

  // Extract tasks and pagination data from response
  const tasks = data?.data.data || [];
  const totalItems = data?.data.total || 0;

  const handlePageChange = (page: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      skip: (page - 1) * prev.take,
    }));
  };

  const handleItemsPerPageChange = (take: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      take,
      skip: 0, // Reset to first page when changing items per page
    }));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsUpdateTaskFormOpen(true);
  };

  const handleUpdateSuccess = () => {
    setIsUpdateTaskFormOpen(false);
    setEditingTask(null);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500 text-center">
          Error loading tasks: {error.message}
        </div>
      </div>
    );
  }

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
        <CardContent className="space-y-4">
          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center space-x-2">
              <label htmlFor="itemsPerPage" className="text-sm font-medium">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={paginationParams.take}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            {/* Sort controls */}
            <div className="flex items-center space-x-2">
              <select
                value={paginationParams.orderBy}
                onChange={(e) =>
                  setPaginationParams((prev) => ({
                    ...prev,
                    orderBy: e.target.value as
                      | "created_at"
                      | "title"
                      | "status",
                    skip: 0, // Reset to first page when changing sort
                  }))
                }
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at">Created Date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>

              <select
                value={paginationParams.order}
                onChange={(e) =>
                  setPaginationParams((prev) => ({
                    ...prev,
                    order: e.target.value as "asc" | "desc",
                    skip: 0, // Reset to first page when changing order
                  }))
                }
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Task Table */}
          <TaskTable
            tasks={tasks}
            onEdit={handleEditTask}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {!isLoading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={paginationParams.take}
              onPageChange={handlePageChange}
              className="mt-4"
            />
          )}

          {/* Empty state */}
          {!isLoading && tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks found. Create your first task to get started!
            </div>
          )}
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
