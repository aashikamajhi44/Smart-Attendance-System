import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/attendance`;

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return { headers: { Authorization: `Bearer ${user?.token}` } };
};

const getAttendance = async (params = {}) => {
  const res = await axios.get(API_URL, { ...authHeader(), params });
  return res.data;
};

export default { getAttendance };