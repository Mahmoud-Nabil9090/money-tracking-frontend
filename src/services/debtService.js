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

/** PUT /api/debts/:id — update debt fields such as dueDate */
export const updateDebt = async (id, changes) => {
  const res = await api.put(`/debts/${id}`, changes);
  return res.data?.data;
};

/** PATCH /api/debts/:id/paid — close a fully paid debt */
export const markDebtPaid = async (id) => {
  const res = await api.patch(`/debts/${id}/paid`);
  return res.data?.data;
};
