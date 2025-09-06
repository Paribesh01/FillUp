import type React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Eye,
  Edit,
  MoreHorizontal,
  BarChart3,
  Users,
  Share2,
  Code,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock form data - in real app, this would be fetched based on params.id
const formData = {
  id: 1,
  title: "Customer Feedback Survey",
  description: "Collect valuable feedback from our customers",
  status: "Published",
  responses: 234,
  views: 1250,
  createdAt: "2024-01-15",
  lastModified: "2024-01-20",
  category: "Survey",
};

const tabs = [
  { id: "summary", label: "Summary", icon: BarChart3, href: "/summary" },
  { id: "responses", label: "Responses", icon: Users, href: "/responses" },
  { id: "share", label: "Share", icon: Share2, href: "/share" },
  {
    id: "integrations",
    label: "Integrations",
    icon: Code,
    href: "/integrations",
  },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export default function FormLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 border-green-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/forms">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {formData.title}
                </h1>
                <Badge
                  className={cn("text-xs", getStatusColor(formData.status))}
                >
                  {formData.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{formData.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const href = `/form/${params.id}/${tab.href}`;
                return (
                  <Link
                    key={tab.id}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                      "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {children}
        </div>
      </main>
    </div>
  );
}
