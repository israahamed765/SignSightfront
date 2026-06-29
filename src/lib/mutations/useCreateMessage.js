
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import toast from "react-hot-toast";

const createMessage = async (payload) => {
  const response = await api.post("/api/contacts", payload);
  return response.data;
};

export const useCreateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
    },
    onError: (error) => {
      toast.error("عذراً، حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
      console.error("Strapi Error:", error.response?.data);
    },
  });
};
