"use client";

import { CheckCircle2, Clock, ZapOff as MapOff, Users } from "lucide-react";
import { Card } from "@/components/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/components/ui/table";
import { Badge } from "@/components/components/ui/badge";

// Mock data for demonstration
const checkedInUsers = [
  {
    id: 1,
    name: "John",
    surname: "Smith",
    team: "Engineering",
    checkInTime: "08:15 AM",
    status: "Present",
    isOut: false,
  },
  {
    id: 2,
    name: "Sarah",
    surname: "Johnson",
    team: "Design",
    checkInTime: "08:45 AM",
    status: "Present",
    isOut: false,
  },
  {
    id: 3,
    name: "Michael",
    surname: "Brown",
    team: "Engineering",
    checkInTime: "08:30 AM",
    status: "Out",
    isOut: true,
  },
  {
    id: 4,
    name: "Emily",
    surname: "Davis",
    team: "Marketing",
    checkInTime: "09:00 AM",
    status: "Present",
    isOut: false,
  },
  {
    id: 5,
    name: "David",
    surname: "Wilson",
    team: "Engineering",
    checkInTime: "08:20 AM",
    status: "Present",
    isOut: false,
  },
];

const notCheckedInUsers = [
  {
    id: 6,
    name: "Jessica",
    surname: "Martinez",
    team: "Design",
    expectedTime: "09:00 AM",
    status: "Pending",
  },
  {
    id: 7,
    name: "Robert",
    surname: "Taylor",
    team: "Sales",
    expectedTime: "09:00 AM",
    status: "Pending",
  },
  {
    id: 8,
    name: "Lisa",
    surname: "Anderson",
    team: "Engineering",
    expectedTime: "09:00 AM",
    status: "Late",
  },
  {
    id: 9,
    name: "James",
    surname: "Thomas",
    team: "Marketing",
    expectedTime: "09:00 AM",
    status: "Absent",
  },
];

export function CheckInTables() {
  return (
    <div className="space-y-5 p-6">
      {/* Checked In Table */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Checked In</h2>
          <p className="text-sm text-muted-foreground">
            {checkedInUsers.length} users
          </p>
        </div>
      </div>
      <Card className="border-l-4 border-l-green-500 shadow-lg py-0 px-1">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="p-10">
              <TableRow className="bg-green-50 hover:bg-green-50">
                <TableHead className="w-10 p-4">Status</TableHead>
                <TableHead className="p-3">Name</TableHead>
                <TableHead className="p-3">Team</TableHead>
                <TableHead className="p-3">Check-in Time</TableHead>
                <TableHead className="p-3">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkedInUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-green-50/50">
                  <TableCell className="p-5">
                    <div className="flex justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium ">
                    {user.name} {user.surname}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50">
                      {user.team}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.checkInTime}
                  </TableCell>
                  <TableCell>
                    {user.isOut ? (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-900"
                      >
                        <MapOff className="w-3 h-3 mr-1" />
                        Out
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-900"
                      >
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

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
          <Clock className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Not Checked In</h2>
          <p className="text-sm text-muted-foreground">
            {notCheckedInUsers.length} users
          </p>
        </div>
      </div>
      {/* Not Checked In Table */}
      <Card className="border-l-4 border-l-amber-500 shadow-lg p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50 hover:bg-amber-50">
                <TableHead className="w-10 p-3">Status</TableHead>
                <TableHead className="p-3">Name</TableHead>
                <TableHead className="p-3">Team</TableHead>
                <TableHead className="p-3">Expected Time</TableHead>
                <TableHead className="p-3">Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notCheckedInUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-amber-50/50">
                  <TableCell className="p-5">
                    <div className="flex justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.name} {user.surname}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50">
                      {user.team}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.expectedTime}
                  </TableCell>
                  <TableCell>
                    {user.status === "Pending" && (
                      <Badge className="bg-blue-100 text-blue-900">
                        Pending
                      </Badge>
                    )}
                    {user.status === "Late" && (
                      <Badge className="bg-yellow-100 text-yellow-900">
                        Late
                      </Badge>
                    )}
                    {user.status === "Absent" && (
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
  );
}
