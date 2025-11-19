import { Badge } from "@/components/components/ui/badge";
import { Card } from "@/components/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/components/ui/table";
import { CheckCircle2, Users, ZapOff as MapOff } from "lucide-react";

export function CheckedInTable({checkedInUsers}: any) {
  return (
    <>
      {/* Header */}
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

      {/* Table */}
      <Card className="border-l-4 border-l-green-500 shadow-lg py-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="[&_th]:py-5 [&_th]:px-4">
              <TableRow className="bg-green-50">
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
                  <TableCell className="font-medium">
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
                      <Badge className="bg-orange-100 text-orange-900">
                        <MapOff className="w-3 h-3 mr-1" /> Out
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-900">
                        <Users className="w-3 h-3 mr-1" /> In Office
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
      </Card>
    </>
  );
}