import api from "./api";

/**
 * جلب جميع المصاريف
 * GET /api/expenses
 */
export const getExpenses = async () => {
  const response = await api.get("/expenses");

  return response.data?.data || [];
};

/**
 * جلب تصنيفات المصاريف
 * GET /api/expense-categories
 */
export const getExpenseCategories = async () => {
  const response = await api.get("/expense-categories");

  return response.data?.data || [];
};

/**
 * جلب الحسابات
 * GET /api/accounts
 */
export const getAccounts = async () => {
  const response = await api.get("/accounts");

  return response.data?.data || [];
};
