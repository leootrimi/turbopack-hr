import { LeaveApprovalSection } from "../../../../features/timeoff/requests/components/leave-approval-section";
import { StatCard } from "../../../../features/timeoff/requests/components/stats-card";

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Request" value={53} percentage={0} color="blue"/>
          <StatCard
            label="New Request"
            value={40}
            percentage={10}
            color="green"
          />
          <StatCard label="Rejected" value={3} percentage={32} color="red"/>
          <StatCard
            label="Pending Request"
            value={15}
            percentage={60}
            color="yellow"
          />
        </div>

        <LeaveApprovalSection />
      </div>
    </main>
  );
}
