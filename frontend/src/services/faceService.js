import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/face-profiles`;

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return { headers: { Authorization: `Bearer ${user?.token}` } };
};

const saveFaceProfile = async (studentId, descriptor) => {
  const res = await axios.post(
    `${API_URL}/${studentId}`,
    { descriptor },
    authHeader()
  );
  return res.data;
};

const getAllFaceProfiles = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

export default { saveFaceProfile, getAllFaceProfiles };