/**
 * تحويل أي تاريخ إلى صيغة YYYY-MM-DD المناسبة لحقول input[type="date"]
 * @param {string|Date} date 
 * @returns {string} YYYY-MM-DD
 */
export function formatDateForInput(date) {
  if (!date) {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * تنسيق التاريخ للعرض
 * @param {string|Date} date 
 * @returns {string}
 */
export function formatDateDisplay(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
}

