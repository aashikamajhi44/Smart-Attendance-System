import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/students`;

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return { headers: { Authorization: `Bearer ${user?.token}` } };
};

const getStudents = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

const addStudent = async (studentData) => {
  const res = await axios.post(API_URL, studentData, authHeader());
  return res.data;
};

const deleteStudent = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, authHeader());
  return res.data;
};

export default { getStudents, addStudent, deleteStudent };