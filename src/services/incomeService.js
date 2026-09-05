import api from "./api";


export const getMonthlyIncome = async (month, year) => {
  const response = await api.get("/income/monthly-summary", {
    params: {
      month,
      year,
    },
  });

  return response.data;
};