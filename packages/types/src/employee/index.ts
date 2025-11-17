export type Employee = {
  id: number;
  name: string;
  position: string;
  department: string;
};

export const mockEmployee: Employee[] = [
  { id: 1, name: "John Doe", position: "Manager", department: "HR" },
  { id: 2, name: "Jane Smith", position: "Developer", department: "IT" },
  { id: 3, name: "Alex Brown", position: "Designer", department: "Marketing" },
  { id: 4, name: "Sophia Lee", position: "QA Tester", department: "IT" },
  {
    id: 5,
    name: "Michael Chen",
    position: "Product Manager",
    department: "Product",
  },
  {
    id: 6,
    name: "Emma Wilson",
    position: "Data Analyst",
    department: "Analytics",
  },
  {
    id: 7,
    name: "James Taylor",
    position: "DevOps Engineer",
    department: "IT",
  },
  {
    id: 8,
    name: "Olivia Martinez",
    position: "UX Researcher",
    department: "Design",
  },
];