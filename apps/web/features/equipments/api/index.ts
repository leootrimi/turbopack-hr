import { makeRequest } from "../../../lib/axios";
import { EquipmentRow, EquipmentDetail } from "@repo/types";

export async function getEquipments() {
  return await makeRequest<EquipmentRow[]>({
    url: "/equipments",
    method: "GET",
  });
}

export async function getMyEquipments() {
  return await makeRequest<EquipmentRow[]>({
    url: "/equipments/my",
    method: "GET",
  });
}

export async function getEquipment(id: string) {
  return await makeRequest<EquipmentDetail>({
    url: `/equipments/${id}`,
    method: "GET",
  });
}

export async function updateEquipment(id: number, data: Partial<EquipmentDetail>) {
  return await makeRequest<EquipmentDetail>({
    url: `/equipments/${id}`,
    method: "PATCH",
    data,
  });
}
