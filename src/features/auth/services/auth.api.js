import api from "../../../lib/axios";

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/local/register", {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  return response.data;
};
