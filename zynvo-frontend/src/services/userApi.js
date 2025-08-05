import axios from "axios";

const API_BASE = "http://localhost:5000/api/users";

export const fetchAllUsers = async (token) => {
  const { data } = await axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return data.users;
};

export const updateUserRole = async (userId, newRole, token) => {
  const { data } = await axios.patch(
    `${API_BASE}/update-role`,
    { userId, role: newRole },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
  return data;
};

export const deleteUser = async (userId, token) => {
  await axios.delete(`${API_BASE}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};
export const fetchUserById = async (userId, token) => {
  const { data } = await axios.get(`${API_BASE}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return data.user;
};