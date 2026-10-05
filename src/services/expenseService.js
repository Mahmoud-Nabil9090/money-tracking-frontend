import api from "./api";

/**
 * جلب جميع المصاريف مع دعم الفلترة (from, to, type, category, account, search)
 * GET /api/expenses
 */
export const getExpenses = async (filters = {}) => {
  const params = {};
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.type && filters.type !== "all") params.type = filters.type;
  if (filters.category && filters.category !== "all") params.category = filters.category;
  if (filters.account && filters.account !== "all") params.account = filters.account;
  if (filters.search) params.search = filters.search;

  const response = await api.get("/expenses", { params });
  return response.data?.data || [];
};

/**
 * جلب تفاصيل مصروف محدد بالـ ID
 * GET /api/expenses/:id مع آلية احتياطية من القائمة إذا لم تكن نقطة النهاية متاحة
 */
export const getExpenseById = async (id) => {
  try {
    const response = await api.get(`/expenses/${id}`);
    if (response.data?.data) {
      return response.data.data;
    }
    if (response.data && (response.data._id || response.data.id)) {
      return response.data;
    }
  } catch {
    // في حال عدم دعم الباك إند للـ GET /expenses/:id مباشرة
  }

  const allExpenses = await getExpenses();
  const expense = allExpenses.find(
    (item) => (item._id || item.id) === id
  );

  if (!expense) {
    throw new Error("لم يتم العثور على بيانات المصروف المطلوب");
  }

  return expense;
};

/**
 * إنشاء مصروف جديد (US-201)
 * POST /api/expenses
 */
export const createExpense = async (expenseData) => {
  const response = await api.post("/expenses", expenseData);
  return response.data;
};

/**
 * تعديل مصروف موجود (US-205)
 * PUT /api/expenses/:id
 */
export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data;
};

/**
 * حذف مصروف
 * DELETE /api/expenses/:id
 */
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

/**
 * جلب تصنيفات المصاريف
 * GET /api/expense-categories
 */
export const getExpenseCategories = async () => {
  const response = await api.get("/expense-categories");
  return response.data?.data || response.data || [];
};

/**
 * جلب الحسابات
 * GET /api/accounts
 */
export const getAccounts = async () => {
  const response = await api.get("/accounts");
  return response.data?.data || response.data || [];
};
