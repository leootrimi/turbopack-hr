import { makeRequest } from "../../../lib/axios";
import { EquipmentRow, EquipmentDetail } from "@repo/types";

export async function getEquipments() {
  return await makeRequest<EquipmentRow[]>({
    url: "/equipments",
    method: "GET",
  });
}

export async function getEquipment(id: string) {
  return await makeRequest<EquipmentDetail>({
    url: `/equipments/${id}`,
    method: "GET",
  });
}
