const API_BASE_URL = "http://localhost:8001";

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("API Request URL:", url);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.detail ||
      data?.message ||
      data?.customer_name?.[0] ||
      data?.phone_number?.[0] ||
      data?.account_number?.[0] ||
      data?.bank_name?.[0] ||
      data?.amount?.[0] ||
      `Request failed: ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
}

export const loginUser = (username, password) =>
  apiRequest("/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const registerUser = (userData) =>
  apiRequest("/register/", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const User_Data = () =>
  apiRequest("/profile/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });


export const createCustomer = (customerData) =>
  apiRequest("/customer/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(customerData),
  });

export const getCustomers = () =>
  apiRequest("/customer/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

export const updateCustomers = (id, customerData) =>
  apiRequest(`/customer/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(customerData),
  });

export const deleteCustomer = (id) =>
  apiRequest(`/customer/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });



export default apiRequest;