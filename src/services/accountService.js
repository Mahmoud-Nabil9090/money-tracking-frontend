import api from "./api";

export const getAccounts = async () => {
  const response = await api.get("/accounts");

  return response.data;
};

export const getAccountTransactions = async (
  accountId,
  filters = {}
) => {
  const params = {};

  if (filters.start) {
    params.start = filters.start;
  }

  if (filters.end) {
    params.end = filters.end;
  }

  const response = await api.get(
    `/accounts/${accountId}/transactions`,
    { params }
  );

  return response.data;
};

export const adjustAccountBalance = async (
  accountId,
  data
) => {
  const response = await api.post(
    `/accounts/${accountId}/adjust`,
    data
  );

  return response.data;
};