import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../api";
import { EmployeeRow } from "@repo/types";

export function useEmployees() {
  return useQuery<EmployeeRow[], Error>({
    queryKey: ["employees"],
    queryFn: getEmployees,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
}