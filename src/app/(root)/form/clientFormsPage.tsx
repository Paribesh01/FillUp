"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Plus,
  BarChart3,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ClientFormsPage({ initialForms }) {
  const [forms] = useState(initialForms);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "All" ||
      (form.published ? "Published" : "Draft") === selectedFilter;
    return matchesSearch && matchesFilter;
  });
  const router = useRouter();

  const handleCopy = (formId) => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${formId}`);
    toast.success("Form link copied!");
  };

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Forms</h1>
              <p className="text-muted-foreground">
                Create and manage your forms
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleCreate}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Form
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground mb-1 line-clamp-1">
                      {form.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      ID: {form.id}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    className={cn(
                      "text-xs",
                      form.published
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    )}
                  >
                    {form.published ? "Published" : "Draft"}
                  </Badge>
                  {form.spreadsheetId && (
                    <Badge variant="secondary" className="text-xs">
                      Sheet: {form.spreadsheetId}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium text-card-foreground">
                      {form.createdAt
                        ? new Date(form.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Updated</p>
                    <p className="font-medium text-card-foreground">
                      {form.updatedAt
                        ? new Date(form.updatedAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <span>User: {form.userId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/form/${form.id}/summary`)}
                    className="flex-1 bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => router.push(`/form/${form.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(form.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredForms.length === 0 && (
            <div className="text-center py-12">
              <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No forms found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first form"}
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Form
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
