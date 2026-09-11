import api from "./api";

/**
 * جلب قائمة الدخل كاملة
 * GET /api/income
 */
export const getIncomeList = async (config = {}) => {
  const response = await api.get("/income", config);
  return response.data;
};

/**
 * جلب جميع مصادر الدخل للمستخدم الحالي
 * GET /api/income
 */
export const getIncomes = async () => {
  const response = await api.get("/income");
  return response.data?.data || [];
};

/**
 * جلب مصدر دخل محدد بواسطة ID
 * @param {string} id
 */
export const getIncomeById = async (id) => {
  const incomes = await getIncomes();
  const income = incomes.find((item) => item._id === id);

  if (!income) {
    throw new Error("لم يتم العثور على مصدر الدخل المطلوب");
  }

  return income;
};

/**
 * إضافة مصدر دخل جديد (US-101)
 * POST /api/income
 */
export const createIncome = async (incomeData) => {
  const response = await api.post("/income", incomeData);
  return response.data;
};

/**
 * تعديل مصدر دخل موجود (US-104)
 * PUT /api/income/:id
 */
export const updateIncome = async (id, incomeData) => {
  const response = await api.put(
    `/income/${encodeURIComponent(id)}`,
    incomeData
  );

  return response.data;
};

/**
 * حذف مصدر دخل (US-105)
 * DELETE /api/income/:id
 */
export const deleteIncome = async (id) => {
  const response = await api.delete(
    `/income/${encodeURIComponent(id)}`
  );

  return response.data;
};

/**
 * جلب ملخص الدخل
 * GET /api/income/summary
 */
export const getIncomeSummary = async (months = 6, config = {}) => {
  const response = await api.get("/income/summary", {
    ...config,
    params: {
      ...config.params,
      months,
    },
  });

  return response.data;
};

/**
 * جلب ملخص الدخل الشهري مع fallback محلي
 */
export const getMonthlyIncome = async (month, year) => {
  try {
    const response = await api.get("/income/monthly-summary", {
      params: { month, year },
    });

    return response.data;
  } catch {
    const all = await getIncomes();

    const items = all.filter((item) => {
      if (!item.receivedDate) return false;

      const d = new Date(item.receivedDate);

      return (
        d.getMonth() + 1 === Number(month) &&
        d.getFullYear() === Number(year)
      );
    });

    const total = items.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    return {
      items,
      total,
      currency: items[0]?.currency || "EGP",
    };
  }
};
