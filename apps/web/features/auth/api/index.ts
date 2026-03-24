import { LoginBody } from "@repo/types";
import { makeRequest } from "../../../lib/axios";

export const loginApi = async (data: LoginBody) => {
  return makeRequest<{ access_token: string }>({
    url: "/auth/login",
    method: "POST",
    data,
  });
};
