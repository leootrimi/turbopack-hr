"use client";

import { useState, useMemo, useEffect } from "react";
import { EquipmentTable } from "./equpiment-table";
import { makeRequest } from "../../../lib/axios";
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
import { EquipmentRow } from "@repo/types";


export function EquipmentOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [equipments, setEquipments] = useState<EquipmentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

   useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        const data = await makeRequest<EquipmentRow[]>({
          url: "/equipments",
          method: "GET",
        });

        setEquipments(data); } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);
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
          <EquipmentTable data={equipments} />
        </Card>
      </div>
    </div>
  );
}
