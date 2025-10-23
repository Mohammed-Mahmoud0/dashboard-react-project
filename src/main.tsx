import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./styles/AppLayout.css";
import LoginPage from "./components/LoginPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Dashboard from "./components/Dashboard.tsx";
import UserManager from "./components/UserManager.tsx";
import Users from "./components/Users.tsx";
import UserDetails from "./components/UserDetails.tsx";
import NoteManager from "./components/NoteManager.tsx";
import Analytics from "./components/Analytics.tsx";
import WeatherWidget from "./components/WeatherWidget.tsx";
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
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        Component: Dashboard,
      },
      {
        path: "users",
        Component: UserManager,
      },
      {
        path: "users/list",
        Component: Users,
      },
      {
        path: "users/:id",
        Component: UserDetails,
      },
      {
        path: "notes",
        Component: NoteManager,
      },
      {
        path: "analytics",
        Component: Analytics,
      },
      {
        path: "weather",
        Component: WeatherWidget,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={route} />
    </QueryClientProvider>
  </StrictMode>
);
