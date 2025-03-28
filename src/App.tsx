import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router";

import { queryClient } from "./api/queryClient";

// Layout components
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

// Page components
import ProductList from "./pages/products/components/ProductList";
import ProductDetail from "./pages/products/components/ProductDetail";
import OrderList from "./pages/orders/components/OrderList";
import OrderDetail from "./pages/orders/components/OrderDetail";
import UserList from "./pages/users/components/UserList";
import UserDetail from "./pages/users/components/UserDetail";

// Root layout component
const RootLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-8 bg-white min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
    <Toaster position="top-center" />
  </div>
);

// Data router configuration
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // Default redirect to /products
      {
        index: true,
        loader: async () => redirect("/products"),
      },
      // Product routes
      { path: "products", Component: ProductList },
      { path: "products/:id", Component: ProductDetail },
      // Order routes
      { path: "orders", Component: OrderList },
      { path: "orders/:id", Component: OrderDetail },
      // User routes
      { path: "users", Component: UserList },
      { path: "users/:id", Component: UserDetail },
    ],
  },
]);

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    {/* React Query Devtools */}
    {import.meta.env.VITE_ENABLE_QUERY_DEVTOOLS === "true" && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </QueryClientProvider>
);

export default App;
