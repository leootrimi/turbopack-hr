'use client'

import { CheckCircle2, Clock, ZapOff as MapOff, Users } from 'lucide-react'
import { Card } from '@/components/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/components/ui/table'
import { Badge } from '@/components/components/ui/badge'

// Mock data for demonstration
const checkedInUsers = [
  {
    id: 1,
    name: 'John',
    surname: 'Smith',
    team: 'Engineering',
    checkInTime: '08:15 AM',
    status: 'Present',
    isOut: false,
  },
  {
    id: 2,
    name: 'Sarah',
    surname: 'Johnson',
    team: 'Design',
    checkInTime: '08:45 AM',
    status: 'Present',
    isOut: false,
  },
  {
    id: 3,
    name: 'Michael',
    surname: 'Brown',
    team: 'Engineering',
    checkInTime: '08:30 AM',
    status: 'Out',
    isOut: true,
  },
  {
    id: 4,
    name: 'Emily',
    surname: 'Davis',
    team: 'Marketing',
    checkInTime: '09:00 AM',
    status: 'Present',
    isOut: false,
  },
  {
    id: 5,
    name: 'David',
    surname: 'Wilson',
    team: 'Engineering',
    checkInTime: '08:20 AM',
    status: 'Present',
    isOut: false,
  },
]

const notCheckedInUsers = [
  {
    id: 6,
    name: 'Jessica',
    surname: 'Martinez',
    team: 'Design',
    expectedTime: '09:00 AM',
    status: 'Pending',
  },
  {
    id: 7,
    name: 'Robert',
    surname: 'Taylor',
    team: 'Sales',
    expectedTime: '09:00 AM',
    status: 'Pending',
  },
  {
    id: 8,
    name: 'Lisa',
    surname: 'Anderson',
    team: 'Engineering',
    expectedTime: '09:00 AM',
    status: 'Late',
  },
  {
    id: 9,
    name: 'James',
    surname: 'Thomas',
    team: 'Marketing',
    expectedTime: '09:00 AM',
    status: 'Absent',
  },
]

export function CheckInTables() {
  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 p-6">
      {/* Checked In Table */}
      <Card className="border-l-4 border-l-green-500 shadow-lg py-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Checked In</h2>
              <p className="text-sm text-muted-foreground">{checkedInUsers.length} users</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background/50 text-black">
                <TableHead className="w-10 p-5">Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkedInUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-background/50">
                  <TableCell className='p-5'>
                    <div className="flex justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.name} {user.surname}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-background">
                      {user.team}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.checkInTime}</TableCell>
                  <TableCell>
                    {user.isOut ? (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-900">
                        <MapOff className="w-3 h-3 mr-1" />
                        Out
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-900">
                        <Users className="w-3 h-3 mr-1" />
                        In Office
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Not Checked In Table */}
      <Card className="border-l-4 border-l-amber-500 shadow-lg py-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Not Checked In</h2>
              <p className="text-sm text-muted-foreground">{notCheckedInUsers.length} users</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background/50 text-black">
                <TableHead className="w-10 p-5">Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Expected Time</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notCheckedInUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-background/50">
                  <TableCell className='p-5'>
                    <div className="flex justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.name} {user.surname}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-background">
                      {user.team}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.expectedTime}</TableCell>
                  <TableCell>
                    {user.status === 'Pending' && (
                      <Badge className="bg-blue-100 text-blue-900">Pending</Badge>
                    )}
                    {user.status === 'Late' && (
                      <Badge className="bg-yellow-100 text-yellow-900">Late</Badge>
                    )}
                    {user.status === 'Absent' && (
                      <Badge className="bg-red-100 text-red-900">Absent</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
