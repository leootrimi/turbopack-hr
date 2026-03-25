import { makeRequest } from "../../../lib/axios";
import { EquipmentRow } from "@repo/types";

export async function getEquipments() {
  return await makeRequest<EquipmentRow[]>({
    url: "/equipments",
    method: "GET",
  });
}

export async function getEquipment(id: string) {
  return await makeRequest<EquipmentRow>({
    url: `/equipments/${id}`,
    method: "GET",
  });
}
