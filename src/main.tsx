import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import LoginPage from "./components/LoginPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Users from "./components/Users.tsx";
import UserDetails from "./components/UserDetails.tsx";
import AppLayout from "./components/AppLayout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  10 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const route = createBrowserRouter([
  { 
    path: "/", 
    Component: LoginPage 
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "users",
        Component: Users,
      },
      {
        path: "users/:id",
        Component: UserDetails,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="body">
        <RouterProvider router={route}></RouterProvider>
      </div>
    </QueryClientProvider>
  </StrictMode>
);
