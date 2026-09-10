import api from "./api";

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
 * @param {object} incomeData 
 */
export const createIncome = async (incomeData) => {
  const response = await api.post("/income", incomeData);
  return response.data;
};

/**
 * تعديل مصدر دخل موجود (US-104)
 * PUT /api/income/:id
 * @param {string} id 
 * @param {object} incomeData 
 */
export const updateIncome = async (id, incomeData) => {
  const response = await api.put(`/income/${id}`, incomeData);
  return response.data;
};

/**
 * حذف مصدر دخل
 * DELETE /api/income/:id
 * @param {string} id 
 */
export const deleteIncome = async (id) => {
  const response = await api.delete(`/income/${id}`);
  return response.data;
};

/**
 * جلب ملخص الدخل الشهري مع آلية دعم تلقائية لقائمة الدخل
 * @param {number} month 
 * @param {number} year 
 */
export const getMonthlyIncome = async (month, year) => {
  try {
    const response = await api.get("/income/monthly-summary", {
      params: { month, year },
    });
    return response.data;
  } catch {
    // في حال عدم توفر هذا الـ endpoint في الباك إند، يتم الحساب محلياً من قائمة الإيرادات
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