import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const register = async (name, email, password, role) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const changePassword = async (newPassword) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const res = await axios.put(
    `${API_URL}/change-password`,
    { newPassword },
    { headers: { Authorization: `Bearer ${user?.token}` } }
  );
  return res.data;
};

export default { login, register, logout, getCurrentUser, changePassword };