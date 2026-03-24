import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api";
import { LoginBody } from "@repo/types";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginBody) => loginApi(data),
  });
};
