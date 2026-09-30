import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    CategoryAPI,
    MedicineAPI,
    NotificationAPI,
    PurchaseOrderAPI,
    SupplierAPI,
    UserAPI
} from "../api/endpoints";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const canManageOrders = isAdmin || user?.role === "Pharmacist";
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const requests = [
        MedicineAPI.list({ page: 0, size: 1000 }),
        SupplierAPI.list(),
        NotificationAPI.list({ page: 0, size: 100 }),
        CategoryAPI.list(),
      ];
      if (isAdmin) requests.push(UserAPI.list());
      if (canManageOrders) requests.push(PurchaseOrderAPI.list({ page: 0, size: 20 }));

      const results = await Promise.allSettled(requests);
      const [medicineResult, supplierResult, notificationResult, categoryResult] = results;
      if (medicineResult.status === "fulfilled") setMedicines((medicineResult.value.data.content || []).map(normalizeMedicine));
      if (supplierResult.status === "fulfilled") setSuppliers((supplierResult.value.data || []).map(normalizeSupplier));
      if (notificationResult.status === "fulfilled") setNotifications((notificationResult.value.data.content || []).map(normalizeNotification));
      if (categoryResult.status === "fulfilled") setCategories(Array.isArray(categoryResult.value.data) ? categoryResult.value.data : categoryResult.value.data?.content || []);

      let resultIndex = 4;
      if (isAdmin) {
        const userResult = results[resultIndex++];
        if (userResult.status === "fulfilled") setUsers((userResult.value.data || []).map(normalizeUser));
      } else {
        setUsers([]);
      }
      if (canManageOrders) {
        const orderResult = results[resultIndex];
        if (orderResult.status === "fulfilled") setOrders((orderResult.value.data.content || []).map(normalizeOrder));
      } else {
        setOrders([]);
      }

      if (results.every((result) => result.status === "rejected")) throw results[0].reason;
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Could not load data from the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setMedicines([]);
      setSuppliers([]);
      setNotifications([]);
      setUsers([]);
      setOrders([]);
      setCategories([]);
      return;
    }
    refresh();
  }, [user]);

  const addMedicine = async (med) => {
    const { data } = await MedicineAPI.create(toMedicineRequest(med, categories));
    setMedicines((prev) => [normalizeMedicine(data), ...prev]);
  };

  const updateMedicine = async (id, patch) => {
    const { data } = await MedicineAPI.update(id, toMedicineRequest(patch, categories));
    setMedicines((prev) => prev.map((m) => (m.id === id ? normalizeMedicine(data) : m)));
  };

  const deleteMedicine = async (id) => {
    await MedicineAPI.remove(id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const addSupplier = async (sup) => {
    const { data } = await SupplierAPI.create(toSupplierRequest(sup));
    setSuppliers((prev) => [normalizeSupplier(data), ...prev]);
  };

  const updateSupplier = async (id, patch) => {
    const { data } = await SupplierAPI.update(id, toSupplierRequest(patch));
    setSuppliers((prev) => prev.map((s) => (s.id === id ? normalizeSupplier(data) : s)));
  };

  const deleteSupplier = async (id) => {
    await SupplierAPI.remove(id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  const inviteUser = async (invite) => {
    const { data } = await UserAPI.invite({
      fullName: invite.name,
      email: invite.email,
      phone: invite.phone,
      role: invite.role.toUpperCase(),
      temporaryPassword: invite.temporaryPassword,
    });
    setUsers((prev) => [normalizeUser(data.user), ...prev]);
    return data;
  };

  const updateUserRole = async (id, role) => {
    const { data } = await UserAPI.updateRole(id, role.toUpperCase());
    setUsers((prev) => prev.map((item) => (item.id === id ? normalizeUser(data) : item)));
    return data;
  };

  const updateUserStatus = async (id, enabled) => {
    const { data } = await UserAPI.updateStatus(id, enabled);
    setUsers((prev) => prev.map((item) => (item.id === id ? normalizeUser(data) : item)));
    return data;
  };

  const markNotificationRead = async (id) => {
    await NotificationAPI.markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = async () => {
    await Promise.all(notifications.filter((n) => !n.read).map((n) => NotificationAPI.markRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name || "Unknown supplier";

  const value = useMemo(
    () => ({
      medicines,
      suppliers,
      notifications,
      users,
      orders,
      categories,
      loading,
      error,
      refresh,
      addMedicine,
      updateMedicine,
      deleteMedicine,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      inviteUser,
      updateUserRole,
      updateUserStatus,
      markNotificationRead,
      markAllNotificationsRead,
      supplierName,
    }),
    [medicines, suppliers, notifications, users, orders, categories, loading, error]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

function normalizeMedicine(medicine) {
  return { ...medicine, category: medicine.categoryName || medicine.category || "Uncategorized" };
}

function normalizeSupplier(supplier) {
  return {
    ...supplier,
    name: supplier.name || "",
    contact: supplier.contactNumber || supplier.contact || "",
    email: supplier.email || "",
    address: supplier.address || "",
    medicinesSupplied: supplier.medicineCount || 0,
  };
}

function normalizeNotification(notification) {
  return { ...notification, time: notification.createdAt || notification.time || "" };
}

function normalizeOrder(order) {
  return { ...order, id: order.id || order.orderNumber, supplierId: order.supplierId || order.supplier?.id, date: order.createdAt || order.date };
}

function normalizeUser(user) {
  return {
    ...user,
    name: user.name || user.fullName || "Unknown user",
    role: user.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "Staff",
    status: user.status || (user.enabled ? "Active" : "Disabled"),
  };
}

function toMedicineRequest(medicine, categories) {
  const categoryId = medicine.categoryId || categories.find((category) => category.name === medicine.category)?.id;
  return { ...medicine, categoryId, category: undefined, id: undefined, supplierName: undefined };
}

function toSupplierRequest(supplier) {
  return { name: supplier.name, contactNumber: supplier.contactNumber || supplier.contact, email: supplier.email, address: supplier.address, notes: supplier.notes };
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
