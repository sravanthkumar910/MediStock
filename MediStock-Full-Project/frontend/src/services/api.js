import api from "../api/axios";

export const BASE_URL = api.defaults.baseURL;

// Central map of the REST endpoints this frontend expects from the
// Spring Boot services described in the project brief. Components call
// these; today they are not yet wired to `api` (the app runs on mock
// data via DataContext), so swapping to live data means implementing
// each function body with the matching `api.get/post/...` call.
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    oauthGoogle: "/auth/oauth2/google",
  },
  medicines: "/medicines",
  suppliers: "/suppliers",
  purchaseOrders: "/purchase-orders",
  stockAlerts: "/stock/alerts",
  expiry: "/expiry",
  notifications: "/notifications",
  reports: "/reports",
  users: "/users",
};

export { api };
export default api;
