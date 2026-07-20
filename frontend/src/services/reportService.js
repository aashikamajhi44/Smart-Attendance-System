import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/reports`;

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return { headers: { Authorization: `Bearer ${user?.token}` } };
};

const getSummary = async (params = {}) => {
  const res = await axios.get(`${API_URL}/summary`, { ...authHeader(), params });
  return res.data;
};

export default { getSummary };