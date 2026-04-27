import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmployees, getEmployee, getEmployeeTeam, updateEmployeeTeam, updateEmployee } from "../api";
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

export function useEmployeeTeam(id: string) {
  return useQuery<any, Error>({
    queryKey: ["employee", id, "team"],
    queryFn: () => getEmployeeTeam(id),
    enabled: !!id,
  });
}

export function useUpdateEmployeeTeam(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: number | null) => updateEmployeeTeam(employeeId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId, "team"] });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
    },
  });
}

export function useUpdateEmployee(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateEmployee(employeeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
    },
  });
}