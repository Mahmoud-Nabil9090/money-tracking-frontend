import api from "./api";

/** GET /api/debts — all debts */
export const getDebts = async () => {
  const res = await api.get("/debts");
  return res.data?.data || [];
};

/** GET /api/debts/summary — US-604 */
export const getDebtSummary = async () => {
  const res = await api.get("/debts/summary");
  return res.data?.data || {};
};
