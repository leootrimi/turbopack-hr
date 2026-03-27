import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEquipments, getEquipment, getMyEquipments, updateEquipment } from "../api";
import { EquipmentRow, EquipmentDetail } from "@repo/types";

export function useEquipments() {
  return useQuery<EquipmentRow[], Error>({
    queryKey: ["equipments"],
    queryFn: getEquipments,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEquipment(id: string) {
  return useQuery<EquipmentDetail, Error>({
    queryKey: ["equipment", id],
    queryFn: () => getEquipment(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useMyEquipments() {
  return useQuery<EquipmentRow[], Error>({
    queryKey: ["my-equipments"],
    queryFn: getMyEquipments,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EquipmentDetail> }) =>
      updateEquipment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipment", String(variables.id)] });
    },
  });
}
