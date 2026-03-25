'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/components/ui/avatar'
import { Button } from '@/components/components/ui/button'
import { Card } from '@/components/components/ui/card'
import { useUpdateLeaveRequestStatus } from '../../hooks/use-time-off'


interface LeaveRequestCardProps {
  id: string
  employeeName: string
  employeeId: string
  avatar: string
  grade: string
  leaveType: string
  duration: string
  reason: string
  dateRange: string
}

export function LeaveRequestCard({
  id,
  employeeName,
  employeeId,
  avatar,
  grade,
  leaveType,
  duration,
  reason,
  dateRange,
}: LeaveRequestCardProps) {
  const { mutate: updateStatus, isPending } = useUpdateLeaveRequestStatus()

  const handleStatusUpdate = (status: 'Approved' | 'Rejected') => {
    updateStatus({ id, status })
  }

  const initials = employeeName
    .split(' ')
    .map((name) => name[0])
    .join('')

  return (
    <Card className="bg-card p-6 gap-2">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-blue-900 border-1">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={employeeName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-card-foreground">{employeeName}</p>
            <p className="text-sm text-muted-foreground">{employeeId}</p>
          </div>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-sm font-medium text-muted-foreground">{grade}</p>
          <p className="text-sm text-muted-foreground">{leaveType}</p>
          <p className="text-sm text-muted-foreground">{duration}</p>
        </div>
      </div>

      <div className="mb-4 space-y-1">
        <p className="font-semibold text-card-foreground">{reason}</p>
        <p className="text-sm text-muted-foreground">{dateRange}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-red-50 text-red-600 hover:bg-red-100"
          onClick={() => handleStatusUpdate('Rejected')}
          disabled={isPending}
        >
          {isPending ? '...' : 'Deny'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-green-50 text-green-600 hover:bg-green-100"
          onClick={() => handleStatusUpdate('Approved')}
          disabled={isPending}
        >
          {isPending ? '...' : 'Approve'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 hover:bg-blue-50"
        >
          Detail
        </Button>
      </div>

    </Card>
  )
}
