import api from "./api";

/**
 * جلب بيانات لوحة التحكم الشاملة
 * GET /api/dashboard?period=month|last_month|3months|custom&from=...&to=...
 */
export const getDashboardData = async (params = {}) => {
  const response = await api.get("/dashboard", { params });
  return response.data?.data || response.data;
};
