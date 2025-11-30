"use client";

import { useState } from "react";
import {
  FileText,
  Heart,
  Plus,
  Download,
  Eye,
  MoreVertical,
  File,
} from "lucide-react";
import { cn } from "@/components/lib/utils";
import { Button } from "@/components/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/components/ui/dropdown-menu";
import { Badge } from "@/components/components/ui/badge";
import { ScrollArea } from "@/components/components/ui/scroll-area";

// Types
interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

// Sample data
const categories: Category[] = [
  {
    id: "contracts",
    name: "Contracts",
    icon: <FileText className="w-4 h-4" />,
    count: 12,
  },
  {
    id: "health",
    name: "Health Insurance",
    icon: <Heart className="w-4 h-4" />,
    count: 8,
  },
  {
    id: "additional",
    name: "Additionals",
    icon: <Plus className="w-4 h-4" />,
    count: 5,
  },
  {
    id: "all",
    name: "All Documents",
    icon: <File className="w-4 h-4" />,
    count: 25,
  },
];

const sampleDocuments: Record<string, Document[]> = {
  contracts: [
    {
      id: "1",
      name: "Employment Contract 2024",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "NDA Agreement",
      type: "PDF",
      size: "1.2 MB",
      uploadedAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Service Agreement",
      type: "DOCX",
      size: "890 KB",
      uploadedAt: "2023-12-20",
    },
  ],
  health: [
    {
      id: "4",
      name: "Health Insurance Policy 2024",
      type: "PDF",
      size: "3.1 MB",
      uploadedAt: "2024-01-01",
    },
    {
      id: "5",
      name: "Medical Records",
      type: "PDF",
      size: "5.6 MB",
      uploadedAt: "2023-11-15",
    },
    {
      id: "6",
      name: "Dental Coverage",
      type: "PDF",
      size: "1.8 MB",
      uploadedAt: "2023-10-05",
    },
  ],
  additional: [
    {
      id: "7",
      name: "Tax Documents 2023",
      type: "PDF",
      size: "4.2 MB",
      uploadedAt: "2024-01-20",
    },
    {
      id: "8",
      name: "Certificate of Completion",
      type: "PDF",
      size: "650 KB",
      uploadedAt: "2023-12-15",
    },
  ],
  all: [],
};

sampleDocuments.all = [
  ...(sampleDocuments.contracts ?? []),
  ...(sampleDocuments.health ?? []),
  ...(sampleDocuments.additional ?? []),
];

export function DocumentsTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const currentDocuments = sampleDocuments[selectedCategory] || [];
  const filteredDocuments = currentDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-">
        <Card className="h-full border-none rounded-none shadow-lg">
          <CardContent className="p-0">
            <nav className="space-y-1 px-3 pb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedCategory === category.id
                      ? "bg-card text-primary shadow-md"
                      : "text-primary hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <span>{category.name}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-auto",
                      selectedCategory === category.id &&
                        "bg-primary-foreground/20"
                    )}
                  >
                    {category.count}
                  </Badge>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 p-4">
        <div className="flex items-center justify-end">
          <Button className="gap-2 text-foreground" variant="outline">
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {/* Documents List */}
        <ScrollArea className="flex-1">
          <div className="grid gap-4 pb-4">
            {filteredDocuments.length === 0 ? (
              <Card className="border-none shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    No documents found
                  </p>  
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Try adjusting your search or upload a new document
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDocuments.map((doc) => (
                // <Card
                //   key={doc.id}
                //   className="border-none shadow-md hover:shadow-xl transition-all duration-300 group"
                // >
                  <CardContent className="p-6 py-1 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base mb-1 truncate">
                            {doc.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="font-medium">{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>Uploaded {doc.uploadedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 hover:bg-accent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 hover:bg-accent"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 hover:bg-accent"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem>Move to</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                // </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
