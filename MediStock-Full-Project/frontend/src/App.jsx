import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import ExpiryTracking from "./pages/ExpiryTracking";
import Login from "./pages/Login";
import Medicines from "./pages/Medicines";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import PurchaseOrders from "./pages/PurchaseOrders";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import StockAlerts from "./pages/StockAlerts";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/app" : "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="medicines" element={<Medicines />} />
              <Route path="stock-alerts" element={<StockAlerts />} />
              <Route path="expiry" element={<ExpiryTracking />} />
              <Route
                path="suppliers"
                element={
                  <ProtectedRoute roles={["Admin", "Pharmacist"]}>
                    <Suppliers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="categories"
                element={
                  <ProtectedRoute roles={["Admin", "Pharmacist", "Staff"]}>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="purchase-orders"
                element={
                  <ProtectedRoute roles={["Admin", "Pharmacist"]}>
                    <PurchaseOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ProtectedRoute roles={["Admin", "Pharmacist"]}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route path="notifications" element={<Notifications />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute roles={["Admin"]}>
                    <Users />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
