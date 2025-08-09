import axios from "axios";
const moderatorAPI = axios.create({
  baseURL: "http://localhost:5000/api/moderator",
  withCredentials: true,
});

// Create Vendor
export const createVendor = async (formData, token) => {
  const response = await moderatorAPI.post("/", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};