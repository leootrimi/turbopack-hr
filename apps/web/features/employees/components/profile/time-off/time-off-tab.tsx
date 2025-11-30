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

export default function TimeOffTab() {
  return (
    <div className="p-6">
      <div className="flex justify-between gap-4 ">
        <DaysOffCarousel cardStates={mockCardStates} />
        <UsedTimeOffCard
          used={{
            vacation: 5,
            sick: 2,
            personal: 0,
          }}
        />
      </div>
      <TimeOffRequestsTable />
    </div>
  );
}
