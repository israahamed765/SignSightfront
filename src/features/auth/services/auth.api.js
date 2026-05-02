import axios from "../../../lib/axios"; // استخدام @ للوصول للمسار المختصر أسهل

export const registerUser = async (userData) => {
  // ملف axios.js يضيف /api في baseURL بالفعل، لذلك المسار هنا بدون /api
  const response = await axios.post("http://localhost:1337/api/auth/local/register", {
    username: userData.username, // Strapi يتطلب username بشكل أساسي
    email: userData.email,
    password: userData.password,
  });

  return response.data;
};
