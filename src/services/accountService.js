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

export const adjustAccountBalance = async (accountId, data) => {
  const response = await api.post(`/accounts/${accountId}/adjust`, data);
  return response.data;
};

export const createAccount = async (data) => {
  const response = await api.post("/accounts", data);
  return response.data;
};

export const updateAccount = async (accountId, data) => {
  const response = await api.put(`/accounts/${accountId}`, data);
  return response.data;
};

export const archiveAccount = async (accountId) => {
  const response = await api.patch(`/accounts/${accountId}/archive`);
  return response.data;
};

export const restoreAccount = async (accountId) => {
  const response = await api.patch(`/accounts/${accountId}/restore`);
  return response.data;
};

export const deleteAccount = async (accountId) => {
  const response = await api.delete(`/accounts/${accountId}`);
  return response.data;
};

export const getAccountById = async (accountId) => {
  const response = await api.get("/accounts");
  const list = Array.isArray(response.data) ? response.data : response.data?.data || [];
  return list.find((acc) => (acc._id || acc.id) === accountId) || null;
};