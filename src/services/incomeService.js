import api from "./api";

export const getIncomeList = async (config = {}) => {
  const response = await api.get("/income", config);
  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await api.delete(`/income/${encodeURIComponent(id)}`);
  return response.data;
};

export const getIncomeSummary = async (months = 6, config = {}) => {
  const response = await api.get("/income/summary", {
    ...config,
    params: { ...config.params, months },
  });
  return response.data;
};


export const getMonthlyIncome = async (month, year) => {
  const response = await api.get("/income/monthly-summary", {
    params: {
      month,
      year,
    },
  });

  return response.data;
};
