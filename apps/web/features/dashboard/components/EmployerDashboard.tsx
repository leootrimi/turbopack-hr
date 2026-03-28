"use client";

import { useState } from "react";
import { AnnouncementsWidget } from "./AnnouncementsWidget";
import { AttendanceChart } from "./AttendanceChart";
import { CheckInPanel } from "./CheckInPanel";
import { LeaveCarousel } from "./LeaveCarousel";
import { MilestonesWidget } from "./MilestonesWidget";
import { NewAnnouncementModal } from "./NewAnnouncementModal";
import { QuickActions } from "./QuickActions";
import { RecentRequests } from "./RecentRequests";
import { Card } from "./shared";
import { TeamOverview } from "./TeamOverview";
import { DashboardHeader } from "./DashboardHeader";
import { useAuth } from "../../auth/hooks/useAuth";

// layout primitives

export function EmployerDashboard() {
  const [showModal, setShowModal] = useState(false);
  const { isAdmin } = useAuth()
  return (
    <div
      className="min-h-screen bg-slate-50 p-6"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <div className="max-w-[1400px] mx-auto">

        <DashboardHeader />

        <div className="grid grid-cols-12 gap-4">

          {isAdmin &&
            <Card className="col-span-12 p-5">
              <TeamOverview />
            </Card>
          }

          <Card className="col-span-12 lg:col-span-5 p-5 min-h-[380px]">
            <CheckInPanel />
          </Card>

          <Card className="col-span-12 lg:col-span-4 p-5 min-h-[380px]">
            <AnnouncementsWidget onNew={() => setShowModal(true)} />
          </Card>

          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <Card className="p-5">
              <MilestonesWidget />
            </Card>
            {isAdmin &&
              <Card className="p-5">
                <QuickActions />
              </Card>}

          </div>

          <Card className="col-span-12 p-5">
            <LeaveCarousel />
          </Card>

          {isAdmin && (
            <>
              <Card className="col-span-12 lg:col-span-5 p-5 h-72">
                <RecentRequests />
              </Card>

              <Card className="col-span-12 lg:col-span-7 p-5 h-72">
                <AttendanceChart />
              </Card>
            </>
          )
          }
        </div>
      </div>

      {/* announcement modal */}
      {showModal && (
        <NewAnnouncementModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
