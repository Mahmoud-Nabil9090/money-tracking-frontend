import api from "./api";

// توحيد شكل التصنيفات لو الـAPI رجّعها مباشرة أو داخل data أو categories.
function getCategoriesFromResponse(response) {
  const payload = response.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return Array.isArray(payload?.categories) ? payload.categories : [];
}

// جلب كل تصنيفات المصاريف من الباك إند.
export async function getExpenseCategories() {
  const response = await api.get("/expense-categories");
  return getCategoriesFromResponse(response);
}

// إضافة تصنيف جديد وإرسال بياناته للباك إند.
export async function createExpenseCategory(categoryData) {
  const response = await api.post("/expense-categories", categoryData);
  return response.data;
}

// تعديل بيانات تصنيف محدد باستخدام المعرّف الخاص به.
export async function updateExpenseCategory(id, categoryData) {
  const response = await api.put(`/expense-categories/${id}`, categoryData);
  return response.data;
}

// حذف تصنيف محدد باستخدام المعرّف الخاص به.
export async function deleteExpenseCategory(id) {
  const response = await api.delete(`/expense-categories/${id}`);
  return response.data;
}
