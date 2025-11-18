'use client'

import { Badge } from "@/components/components/ui/badge"
import { LeaveRequestCard } from "./leave-request-card"


const mockLeaveRequests = [
  {
    id: '1',
    employeeName: 'Ritika Shrestha',
    employeeId: '20332',
    avatar: '/woman-dark-hair.png',
    grade: "10 'A'",
    leaveType: 'Sick Leave',
    duration: '3 days',
    reason: 'High Fever',
    dateRange: '14 November -17 November',
  },
  {
    id: '2',
    employeeName: 'Manisha Karki',
    employeeId: '20332',
    avatar: '/curly-haired-woman.png',
    grade: "5 'A'",
    leaveType: 'Casual',
    duration: '3 days',
    reason: "Sister's Wedding",
    dateRange: '14 November -17 November',
  },
  {
    id: '3',
    employeeName: 'Ritika Shrestha',
    employeeId: '20332',
    avatar: '/woman-dark-hair.png',
    grade: "10 'A'",
    leaveType: 'Sick Leave',
    duration: '3 days',
    reason: 'High Fever',
    dateRange: '14 November -17 November',
  },
  {
    id: '4',
    employeeName: 'Manisha Karki',
    employeeId: '20332',
    avatar: '/curly-haired-woman.png',
    grade: "5 'A'",
    leaveType: 'Casual',
    duration: '3 days',
    reason: "Sister's Wedding",
    dateRange: '14 November -17 November',
  },
]

export function LeaveApprovalSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground">Leave Approval</h2>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          Pending
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {mockLeaveRequests.map((request) => (
          <LeaveRequestCard key={request.id} {...request} />
        ))}
      </div>
    </section>
  )
}
