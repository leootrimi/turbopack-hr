import { useQuery } from "@tanstack/react-query";
import { getEquipments, getEquipment } from "../api";
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
