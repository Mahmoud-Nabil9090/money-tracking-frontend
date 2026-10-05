export const expenseTypes = [
  { value: "daily", label: "يومي", color: "red", hex: "#ef4444" },
  { value: "fixed", label: "شهري ثابت", color: "yellow", hex: "#f59e0b" },
  { value: "emergency", label: "طارئ", color: "gray", hex: "#6b7280" },
];

/**
 * التصنيفات الافتراضية الأساسية للنظام (US-202)
 */
export const DEFAULT_EXPENSE_CATEGORIES = [
  { _id: "def-food", name: "أكل", type: "daily", color: "#ef4444", isDefault: true },
  { _id: "def-trans", name: "مواصلات", type: "daily", color: "#ef4444", isDefault: true },
  { _id: "def-rent", name: "إيجار", type: "fixed", color: "#f59e0b", isDefault: true },
  { _id: "def-bills", name: "فواتير", type: "fixed", color: "#f59e0b", isDefault: true },
  { _id: "def-health", name: "صحة", type: "emergency", color: "#6b7280", isDefault: true },
  { _id: "def-edu", name: "تعليم", type: "fixed", color: "#f59e0b", isDefault: true },
  { _id: "def-ent", name: "تسلية", type: "daily", color: "#ef4444", isDefault: true },
  { _id: "def-other", name: "غيره", type: "daily", color: "#ef4444", isDefault: true },
];

const DEFAULT_NAMES = new Set([
  "أكل",
  "طعام",
  "أكل وشرب",
  "مواصلات",
  "إيجار",
  "فواتير",
  "صحة",
  "تعليم",
  "تسلية",
  "غيره",
  "أخرى",
]);

/**
 * التحقق مما إذا كان التصنيف أساسياً/افتراضياً لمنع حذفه من الواجهة
 */
export function isDefaultCategory(category) {
  if (!category) return false;
  if (category.isDefault || category.is_default || category.default) {
    return true;
  }
  const name = category.name?.trim();
  return DEFAULT_NAMES.has(name);
}

/**
 * تحديد نوع المصروف للتصنيف (daily, fixed, emergency) بدقة
 */
export function getCategoryType(category) {
  if (category?.type && ["daily", "fixed", "emergency"].includes(category.type)) {
    return category.type;
  }

  const color = category?.color?.toLowerCase?.();
  if (color === "#ef4444" || color === "red") return "daily";
  if (color === "#f59e0b" || color === "#eab308" || color === "yellow") return "fixed";
  if (color === "#6b7280" || color === "gray" || color === "grey") return "emergency";

  const name = category?.name?.trim?.();
  if (name === "إيجار" || name === "فواتير" || name === "تعليم") return "fixed";
  if (name === "صحة" || name === "طوارئ") return "emergency";
  return "daily";
}

/**
 * دمج التصنيفات الافتراضية مع التصنيفات المخصصة القادمة من الباك إند
 */
export function mergeWithDefaultCategories(customCategories = []) {
  const customList = Array.isArray(customCategories) ? customCategories : [];
  const existingNames = new Set(customList.map((c) => c.name?.trim()));

  const missingDefaults = DEFAULT_EXPENSE_CATEGORIES.filter(
    (d) => !existingNames.has(d.name)
  );

  return [...missingDefaults, ...customList];
}
