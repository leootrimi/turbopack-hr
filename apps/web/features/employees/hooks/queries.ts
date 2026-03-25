import { useQuery } from "@tanstack/react-query";
import { getEmployees, getEmployee } from "../api";
import { EmployeeRow } from "@repo/types";

export function useEmployees() {
  return useQuery<EmployeeRow[], Error>({
    queryKey: ["employees"],
    queryFn: getEmployees,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
}

export function useEmployee(id: string) {
  return useQuery<any, Error>({
    queryKey: ["employee", id],
    queryFn: () => getEmployee(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}