import { TasksPage } from "@/features/tasks/pages/TasksPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([{ path: "/", element: <TasksPage /> }]);

export const AppRouter = () => <RouterProvider router={router} />;
