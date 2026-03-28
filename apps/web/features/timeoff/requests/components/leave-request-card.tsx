'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  User, 
  Briefcase, 
  MessageSquare,
  MoreHorizontal,
  FileText,
  ChevronRight
} from 'lucide-react'
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
  submittedDate?: string
  status?: 'Pending' | 'Approved' | 'Rejected'
}

// Leave type configurations
const leaveTypeConfig: Record<string, { color: string; bg: string; icon: string }> = {
  'Vacation': { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '🌴' },
  'Sick Leave': { color: 'text-blue-600', bg: 'bg-blue-50', icon: '🤒' },
  'Personal': { color: 'text-purple-600', bg: 'bg-purple-50', icon: '👤' },
  'Bereavement': { color: 'text-slate-600', bg: 'bg-slate-50', icon: '🕊️' },
  'Maternity': { color: 'text-pink-600', bg: 'bg-pink-50', icon: '👶' },
  'Unpaid': { color: 'text-amber-600', bg: 'bg-amber-50', icon: '💰' },
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
  submittedDate = '2 days ago',
  status = 'Pending',
}: LeaveRequestCardProps) {
  const { mutate: updateStatus, isPending } = useUpdateLeaveRequestStatus()
  const [isExpanded, setIsExpanded] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleStatusUpdate = (status: 'Approved' | 'Rejected') => {
    setActionLoading(status)
    updateStatus({ id, status }, {
      onSettled: () => setActionLoading(null)
    })
  }

  const initials = employeeName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)

  const typeConfig = leaveTypeConfig[leaveType] || { color: 'text-slate-600', bg: 'bg-slate-50', icon: '📋' }
  
  const getStatusBadge = () => {
    switch (status) {
      case 'Approved':
        return { color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle, text: 'Approved' }
      case 'Rejected':
        return { color: 'text-red-700', bg: 'bg-red-50', icon: XCircle, text: 'Rejected' }
      default:
        return { color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock, text: 'Pending' }
    }
  }

  const StatusIcon = getStatusBadge().icon

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Status Indicator Bar */}
      <div className={`absolute top-0 left-0 h-1 w-full transition-all duration-300 ${
        status === 'Approved' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
        status === 'Rejected' ? 'bg-gradient-to-r from-red-400 to-red-500' :
        'bg-gradient-to-r from-amber-400 to-amber-500'
      }`} />
      
      <div className="p-5">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar with status ring */}
            <div className="relative">
              <div className={`
                absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-white
                ${status === 'Approved' ? 'ring-emerald-400' : 
                  status === 'Rejected' ? 'ring-red-400' : 
                  'ring-amber-400'}
              `} />
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt={employeeName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold text-slate-600">{initials}</span>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-slate-800">{employeeName}</h3>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">{employeeId}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Briefcase size={12} />
                <span>{grade}</span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`${getStatusBadge().bg} rounded-full px-2.5 py-1 flex items-center gap-1.5`}>
            <StatusIcon size={12} className={getStatusBadge().color} />
            <span className={`text-xs font-medium ${getStatusBadge().color}`}>
              {getStatusBadge().text}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          {/* Leave Type & Duration Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`${typeConfig.bg} rounded-lg px-2.5 py-1.5 flex items-center gap-1.5`}>
              <span className="text-sm">{typeConfig.icon}</span>
              <span className={`text-xs font-medium ${typeConfig.color}`}>{leaveType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock size={12} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={12} />
              <span>{dateRange}</span>
            </div>
          </div>

          {/* Reason Section */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
            <div className="flex items-start gap-2">
              <MessageSquare size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Reason</p>
                <p className="text-sm text-slate-700">{reason}</p>
              </div>
            </div>
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className="space-y-2 pt-2 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Submitted
                  </p>
                  <p className="text-xs text-slate-700">{submittedDate}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Request ID
                  </p>
                  <p className="text-xs text-slate-700 font-mono">#{id.slice(0, 8)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {status === 'Pending' && (
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleStatusUpdate('Rejected')}
                disabled={!!actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'Rejected' ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <XCircle size={14} />
                )}
                Deny
              </button>
              <button
                onClick={() => handleStatusUpdate('Approved')}
                disabled={!!actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'Approved' ? (
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle size={14} />
                )}
                Approve
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <MoreHorizontal size={16} className="text-slate-400" />
              </button>
            </div>
          )}

          {/* View Details Link (for non-pending requests) */}
          {status !== 'Pending' && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between pt-2 text-xs text-slate-500 hover:text-slate-700 transition-colors group"
            >
              <span className="flex items-center gap-1">
                <FileText size={12} />
                View Details
              </span>
              <ChevronRight 
                size={14} 
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}