import DaysOffCarousel from "./days-carousel";
import { TimeOffRequestsTable } from "./table/table";
import { UsedTimeOffCard } from "./used-days";

const mockCardStates = [
  {
    days: 5,
    title: "Annual Leave",
    description: "Remaining vacation days for this year.",
  },
  {
    days: 2,
    title: "Sick Leave",
    description: "Approved sick leave days.",
  },
  {
    days: 1,
    title: "Personal Day",
    description: "A day reserved for personal matters.",
  },
];

interface TimeOffTabProps {
  timeOffBalance: Array<{ typeName: string; total: string | number; used: string | number }>;
  leaveRequests: any[];
}

export default function TimeOffTab({ timeOffBalance, leaveRequests }: TimeOffTabProps) {
  const balances = Array.isArray(timeOffBalance) ? timeOffBalance : [];

  const cardStates = balances
    .filter(b => Number(b.total) < 9999) // exclude untracked or unlimited
    .map(b => ({
      days: Number(b.total) - Number(b.used),
      title: b.typeName,
      description: `Remaining ${b.typeName.toLowerCase()} days.`,
    }));

  const usedData = balances.map(b => ({ typeName: b.typeName, used: Number(b.used) }));

  return (
    <div className="p-6">
      <div className="flex justify-between gap-4 ">
        {cardStates.length > 0 ? (
          <DaysOffCarousel cardStates={cardStates} />
        ) : (
          <div className="flex-1" />
        )}
        <UsedTimeOffCard usedData={usedData} />
      </div>
      <TimeOffRequestsTable requests={leaveRequests} />
    </div>
  );
}
