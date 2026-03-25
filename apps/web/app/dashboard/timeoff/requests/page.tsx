"use client";

import { useState } from "react";
import { LeaveApprovalSection } from "../../../../features/timeoff/requests/components/leave-approval-section";
import { StatCard } from "../../../../features/timeoff/requests/components/stats-card";
import { useDashboardTimeOffRequests } from "../../../../features/timeoff/hooks/use-time-off";
import { Button } from "@/components/components/ui/button";

export default function Page() {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, isLoading, error } = useDashboardTimeOffRequests(page, perPage);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-xl text-red-500">Error loading data</div>
      </main>
    );
  }

  const summary = data?.summary || {
    totalRequests: 0,
    newRequests: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Request"
            value={summary.totalRequests}
            percentage={0}
            color="blue"
          />
          <StatCard
            label="New Request"
            value={summary.newRequests}
            percentage={0}
            color="green"
          />
          <StatCard
            label="Rejected"
            value={summary.rejected}
            percentage={0}
            color="red"
          />
          <StatCard
            label="Pending Request"
            value={summary.pending}
            percentage={0}
            color="yellow"
          />
        </div>

        <LeaveApprovalSection requests={data?.items || []} />

        <div className="flex justify-center items-center gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="font-medium text-muted-foreground">
            Page {page}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={(data?.items.length || 0) < perPage}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}

