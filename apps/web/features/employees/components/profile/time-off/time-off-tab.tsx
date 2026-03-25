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
  timeOffBalance: {
    vacationTotal: number;
    vacationUsed: number;
    sickTotal: number;
    sickUsed: number;
    personalTotal: number;
    personalUsed: number;
  };
  leaveRequests: any[];
}

export default function TimeOffTab({ timeOffBalance, leaveRequests }: TimeOffTabProps) {
  const vacationTotal = Number(timeOffBalance.vacationTotal);
  const vacationUsed = Number(timeOffBalance.vacationUsed);
  const sickTotal = Number(timeOffBalance.sickTotal);
  const sickUsed = Number(timeOffBalance.sickUsed);
  const personalTotal = Number(timeOffBalance.personalTotal);
  const personalUsed = Number(timeOffBalance.personalUsed);

  const annualLeaveRemaining = vacationTotal - vacationUsed;
  const sickLeaveRemaining = sickTotal - sickUsed;
  const personalRemaining = personalTotal - personalUsed;

  const cardStates = [
    {
      days: annualLeaveRemaining,
      title: "Annual Leave",
      description: "Remaining vacation days for this year.",
    },
    {
      days: sickLeaveRemaining,
      title: "Sick Leave",
      description: "Approved sick leave days.",
    },
    {
      days: personalRemaining,
      title: "Personal Day",
      description: "A day reserved for personal matters.",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between gap-4 ">
        <DaysOffCarousel cardStates={cardStates} />
        <UsedTimeOffCard
          used={{
            vacation: vacationUsed,
            sick: sickUsed,
            personal: personalUsed,
          }}
        />
      </div>
      <TimeOffRequestsTable requests={leaveRequests} />
    </div>
  );
}
