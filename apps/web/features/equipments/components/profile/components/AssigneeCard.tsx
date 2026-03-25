'use client';

import React from 'react';
import { User, Clock, AlertCircle, Search, Check, X, UserMinus } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useEmployees } from '../../../../employees/hooks/queries';
import { useUpdateEquipment } from '../../../hooks/queries';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/components/ui/popover';
import { Input } from '@/components/components/ui/input';
import { ScrollArea } from '@/components/components/ui/scroll-area';
import { Button } from '@/components/components/ui/button';

interface AssigneeCardProps {
  equipmentId: number;
  assignedTo?: {
    name: string;
    email: string;
    id: number;
  };
  assignmentDate?: Date;
  returnDueDate?: Date;
}

export function AssigneeCard({ 
  equipmentId,
  assignedTo, 
  assignmentDate, 
  returnDueDate 
}: AssigneeCardProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const { data: employees = [] } = useEmployees();
  const { mutate: updateAssignment, isPending } = useUpdateEquipment();

  const filteredEmployees = React.useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter((emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAssign = (employeeId: number) => {
    updateAssignment({ id: equipmentId, data: { assignedTo: employeeId } as any });
    setOpen(false);
  };

  const handleUnassign = () => {
    updateAssignment({ id: equipmentId, data: { assignedTo: 0 } as any });
  };

  const isOverdue = returnDueDate && new Date(returnDueDate) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg">
            <User size={18} className="text-slate-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Assignment</h3>
        </div>
        
        {assignedTo && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
            onClick={handleUnassign}
            title="Unassign Equipment"
            disabled={isPending}
          >
            <UserMinus size={16} />
          </Button>
        )}
      </div>

      {assignedTo ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Assigned To
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {assignedTo.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{assignedTo.name}</p>
                <p className="text-xs text-slate-500 truncate">{assignedTo.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Assignment Date
                </p>
                <p className="text-sm text-slate-900">
                  {formatDate(assignmentDate) || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {returnDueDate && (
            <div className={`border-t border-slate-100 pt-4 ${isOverdue ? 'bg-red-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl' : ''}`}>
              <div className="flex items-start gap-3">
                {isOverdue && <AlertCircle size={16} className="text-red-600 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Return Due Date
                  </p>
                  <p className={`text-sm ${isOverdue ? 'text-red-700 font-semibold' : 'text-slate-900'}`}>
                    {formatDate(returnDueDate)}
                  </p>
                  {isOverdue && (
                    <p className="text-xs text-red-600 mt-1 font-medium">⚠️ Equipment return is overdue</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <User size={20} className="text-slate-400" />
          </div>
          <p className="text-sm text-slate-600 font-medium">Not Assigned</p>
          <p className="text-xs text-slate-500 mt-1 mb-6">This equipment is currently available</p>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2 text-slate-600 border-slate-200">
                <Search size={14} className="text-slate-400" />
                Assign to employee...
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Search employees..."
                  className="flex h-11 w-full border-0 bg-transparent py-3 text-sm outline-hidden focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="h-60">
                <div className="p-1">
                  {filteredEmployees.length === 0 ? (
                    <p className="p-4 text-center text-sm text-slate-500">No employees found.</p>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <button
                        key={employee.id}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                        onClick={() => handleAssign(employee.id)}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                          {employee.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {employee.fullName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{employee.email}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
