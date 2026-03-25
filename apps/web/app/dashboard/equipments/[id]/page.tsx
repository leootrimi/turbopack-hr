"use client";

import { use } from "react";
import EquipmentDetailPage from "../../../../features/equipments/components/profile/equipment-details";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  return (
    <EquipmentDetailPage params={params} />
  );
}
