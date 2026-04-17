"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useActiveReviewCycle } from "../hooks/queries";
import ManagerReviewPage from "../manager/manager-review";
import PastReviews from "./PastReviews";

interface ReviewsTabProps {
  employeeId: string;
}

export default function ReviewsTab({ employeeId }: ReviewsTabProps) {
  const { data: activeCycle, isLoading, error } = useActiveReviewCycle();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-slate-400 text-sm">
        <Loader2 size={18} className="animate-spin" />
        Loading review cycle…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        Failed to load review cycle. Please refresh.
      </div>
    );
  }

  if (activeCycle && activeCycle.enabled) {
    return <ManagerReviewPage />;
  }

  return <PastReviews employeeId={employeeId} />;
}
