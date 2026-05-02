import axios from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateMessageMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      // هنا نستخدم => وليس :
      const response = await axios.post("/contacts", { data });
      return response.data;
    },
    onSuccess: () => {
      // هنا نستخدم => وليس :
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
    },
    onError: (error) => {
      // هنا نستخدم => وليس :
      toast.error("عذراً، حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
      console.error("Strapi Error:", error.response?.data);
    },
  });
};
