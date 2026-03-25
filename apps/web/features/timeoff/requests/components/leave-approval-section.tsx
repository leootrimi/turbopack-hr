'use client'

import { Badge } from "@/components/components/ui/badge"
import { LeaveRequestCard } from "./leave-request-card"

interface LeaveApprovalSectionProps {
  requests: Array<{
    id: string;
    employeeName: string;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
  }>;
}

export function LeaveApprovalSection({ requests }: LeaveApprovalSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground">Leave Approval</h2>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          Pending
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {requests.map((request) => (
          <LeaveRequestCard 
            key={request.id} 
            employeeName={request.employeeName}
            employeeId={request.id} // Using ID as fallback for employeeId if not provided
            avatar="" // Fallback for avatar
            grade="N/A" // Fallback for grade
            leaveType={request.type}
            duration={`${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}`}
            reason="Request for time off" // Basic fallback
            dateRange={`${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}`}
          />
        ))}

      </div>
    </section>
  )
}

