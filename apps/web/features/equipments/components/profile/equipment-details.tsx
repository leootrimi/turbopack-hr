'use client';

import { use } from 'react';
import { Loader } from 'lucide-react';
import React from 'react';
import { AssigneeCard } from './components/AssigneeCard';
import { EquipmentHeader } from './components/EquipmentHeader';
import { MetadataCard } from './components/MetadataCard';
import { NotesCard } from './components/NotesCard';
import { PurchaseInfoCard } from './components/PurchaseInfoCard';
import { SpecificationsCard } from './components/SpecificationsCard';

import { useEquipment } from '../../hooks/queries';

export default function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: equipment, isLoading, error } = useEquipment(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="text-slate-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading equipment details...</p>
        </div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600 text-lg font-medium">Equipment not found</p>
            <p className="text-slate-500 mt-2">The requested equipment could be found or an error occurred.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <EquipmentHeader
          name={equipment.name}
          assetTag={equipment.assetTag || 'N/A'}
          serialNumber={equipment.serialNumber || 'N/A'}
          onBack={() => window.history.back()}
        />

        {/* Responsive Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {/* Specifications */}
          <div className="lg:col-span-1">
            <SpecificationsCard
              category={equipment.category}
              brand={equipment.brand}
              model={equipment.model}
              location={equipment.location as any}
            />
          </div>

          {/* Assignment */}
          <div className="lg:col-span-1">
            <AssigneeCard
              equipmentId={equipment.id}
              assignedTo={equipment.assignedTo ? {
                name: equipment.assignedTo.name,
                email: equipment.assignedTo.email,
                id: equipment.assignedTo.id
              } : undefined}
              assignmentDate={equipment.assignmentDate ? new Date(equipment.assignmentDate) : undefined}
              returnDueDate={equipment.returnDueDate ? new Date(equipment.returnDueDate) : undefined}
            />
          </div>

          {/* Purchase Info */}
          <div className="lg:col-span-1">
            {equipment.purchaseInfo && (
              <PurchaseInfoCard
                purchaseDate={equipment.purchaseInfo.purchaseDate ? new Date(equipment.purchaseInfo.purchaseDate) : undefined}
                purchaseCost={equipment.purchaseInfo.purchaseCost !== null ? Number(equipment.purchaseInfo.purchaseCost) : undefined}
                supplier={equipment.purchaseInfo.supplier || undefined}
                warrantyExpiration={equipment.purchaseInfo.warrantyExpiration ? new Date(equipment.purchaseInfo.warrantyExpiration) : undefined}
                condition={equipment.purchaseInfo.condition as any}
                status={equipment.purchaseInfo.status as any}
              />
            )}
          </div>

          {/* Notes */}
          <div className="md:col-span-2 lg:col-span-2">
            <NotesCard
              description={equipment.description || ''}
              notes={equipment.notes || ''}
            />
          </div>

          {/* Metadata */}
          <div className="lg:col-span-1">
            <MetadataCard
              createdAt={new Date(equipment.createdAt)}
              updatedAt={new Date(equipment.updatedAt)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}