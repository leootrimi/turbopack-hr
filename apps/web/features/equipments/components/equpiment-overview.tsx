"use client";

import { useState, useMemo } from "react";
import { EquipmentTable } from "./equpiment-table";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Card } from "@/components/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/components/ui/select";
import { RefreshCw, Plus, Search } from "lucide-react";

// Mock equipment data
const mockEquipment = [
  {
    id: "EQUIP-001",
    type: "Laptop",
    model: 'MacBook Pro 16"',
    serial: "C02ZN9LFMD6V",
    assignedTo: { name: "Sarah Johnson", avatar: "/avatar-sarah.png" },
    department: "Engineering",
    status: "Working",
    purchaseDate: "2023-03-15",
    price: 2499,
    warrantyExpiration: "2026-03-15",
  },
  {
    id: "EQUIP-002",
    type: "Monitor",
    model: 'Dell UltraSharp 27"',
    serial: "DES1234567890",
    assignedTo: { name: "Alex Chen", avatar: "/avatar-alex.png" },
    department: "Engineering",
    status: "Working",
    purchaseDate: "2022-11-20",
    price: 599,
    warrantyExpiration: "2025-11-20",
  },
  {
    id: "EQUIP-003",
    type: "Headphones",
    model: "Sony WH-1000XM5",
    serial: "SY7890ABC1234",
    assignedTo: { name: "Jordan Martinez", avatar: "/avatar-jordan.jpg" },
    department: "Marketing",
    status: "Working",
    purchaseDate: "2024-01-10",
    price: 399,
    warrantyExpiration: "2025-01-10",
  },
  {
    id: "EQUIP-004",
    type: "Laptop",
    model: "ThinkPad X1 Carbon",
    serial: "PF123ABC456DEF",
    assignedTo: { name: "Emma Wilson", avatar: "/avatar-emma.jpg" },
    department: "Sales",
    status: "In Repair",
    purchaseDate: "2023-06-05",
    price: 1899,
    warrantyExpiration: "2026-06-05",
  },
  {
    id: "EQUIP-005",
    type: "Keyboard",
    model: "Keychron K8 Pro",
    serial: "KC98765XY1234",
    assignedTo: { name: "Michael Brown", avatar: "/avatar-michael.png" },
    department: "Engineering",
    status: "Working",
    purchaseDate: "2024-02-14",
    price: 149,
    warrantyExpiration: "2026-02-14",
  },
  {
    id: "EQUIP-006",
    type: "Monitor",
    model: 'LG UltraWide 34"',
    serial: "LG5678910ABCD",
    assignedTo: { name: "Lisa Anderson", avatar: "/avatar-lisa.jpg" },
    department: "Design",
    status: "Returned",
    purchaseDate: "2023-09-20",
    price: 799,
    warrantyExpiration: "2025-09-20",
  },
  {
    id: "EQUIP-007",
    type: "Laptop",
    model: "MacBook Air M2",
    serial: "C02RW0ALMD71",
    assignedTo: { name: "David Kim", avatar: "/diverse-avatars.png" },
    department: "Product",
    status: "Working",
    purchaseDate: "2023-08-12",
    price: 1299,
    warrantyExpiration: "2026-08-12",
  },
  {
    id: "EQUIP-008",
    type: "Mouse",
    model: "Logitech MX Master 3",
    serial: "LG4567890XYZAB",
    assignedTo: { name: "Rachel Green", avatar: "/diverse-avatars.png" },
    department: "Engineering",
    status: "Missing",
    purchaseDate: "2023-12-01",
    price: 99,
    warrantyExpiration: "2024-12-01",
  },
  {
    id: "EQUIP-009",
    type: "Docking Station",
    model: "CalDigit Thunderbolt",
    serial: "CD111222333444",
    assignedTo: { name: "James Wilson", avatar: "/diverse-avatars.png" },
    department: "Engineering",
    status: "Working",
    purchaseDate: "2024-01-20",
    price: 349,
    warrantyExpiration: "2027-01-20",
  },
  {
    id: "EQUIP-010",
    type: "Monitor",
    model: 'ASUS ProArt 32"',
    serial: "AS9876543210XY",
    assignedTo: { name: "Olivia Taylor", avatar: "/diverse-avatars.png" },
    department: "Design",
    status: "Working",
    purchaseDate: "2023-07-08",
    price: 1299,
    warrantyExpiration: "2026-07-08",
  },
];

export function EquipmentOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = mockEquipment.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        equipmentTypeFilter === "all" || item.type === equipmentTypeFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesDepartment =
        departmentFilter === "all" || item.department === departmentFilter;

      return matchesSearch && matchesType && matchesStatus && matchesDepartment;
    });

    if (sortBy === "name") {
      filtered.sort((a, b) =>
        a.assignedTo.name.localeCompare(b.assignedTo.name)
      );
    } else if (sortBy === "type") {
      filtered.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortBy === "department") {
      filtered.sort((a, b) => a.department.localeCompare(b.department));
    }

    return filtered;
  }, [searchTerm, equipmentTypeFilter, statusFilter, departmentFilter, sortBy]);

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Equipment
          </h1>
          <p className="text-muted-foreground">
            Manage and track all company equipment assigned to employees
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, type, model, serial, or assigned to..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              title="Refresh equipment list"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button className="gap-2" variant='outline' title="Add new equipment">
              <Plus className="h-4 w-4" />
              <h1 className="text-foreground">Add Equipment</h1>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={equipmentTypeFilter}
              onValueChange={setEquipmentTypeFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Equipment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="Monitor">Monitor</SelectItem>
                <SelectItem value="Headphones">Headphones</SelectItem>
                <SelectItem value="Keyboard">Keyboard</SelectItem>
                <SelectItem value="Mouse">Mouse</SelectItem>
                <SelectItem value="Docking Station">Docking Station</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Working">Working</SelectItem>
                <SelectItem value="In Repair">In Repair</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
                <SelectItem value="Missing">Missing</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Assigned To</SelectItem>
                <SelectItem value="type">Equipment Type</SelectItem>
                <SelectItem value="department">Department</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Card */}
        <Card className="border-border/50 shadow-sm py-0!">
          <EquipmentTable data={filteredData} />
        </Card>
      </div>
    </div>
  );
}
