"use client";

import { use } from "react";

export default function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Equipment Details: {id}</h1>
      <p className="text-muted-foreground">
        Equipment detail design and implementation will be provided later.
      </p>
    </div>
  );
}
