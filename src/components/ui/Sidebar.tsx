"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Users,
  Palette,
  Zap,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createForm } from "@/app/actions/form";
import { useUser } from "@clerk/nextjs";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { user } = useUser();

  const navigation = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      current: true,
    },
    {
      name: "Forms",
      icon: FileText,
      href: "/form",
      current: false,
      badge: "12",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      current: false,
    },
    {
      name: "Templates",
      icon: Palette,
      href: "/templates",
      current: false,
      badge: "New",
    },
    {
      name: "Team",
      icon: Users,
      href: "/team",
      current: false,
    },
  ];

  const bottomNavigation = [
    {
      name: "Settings",
      icon: Settings,
      href: "/settings",
      current: false,
    },
  ];

  // Add this handler for creating a form and redirecting
  const handleCreate = () => {
    startTransition(async () => {
      const form = await createForm();
      router.push(`/form/${form.id}`);
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">
                T
              </span>
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">
              Tally
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 hover:bg-sidebar-accent/10"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
          )}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search forms..."
              className="w-full pl-10 pr-4 py-2 bg-sidebar border border-sidebar-border rounded-lg text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
            />
          </div>
        </div>
      )}

      {/* Create New Form Button */}
      <div className="p-4">
        <Button
          className={cn(
            "w-full bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-accent-foreground",
            isCollapsed && "px-0"
          )}
          onClick={handleCreate}
          disabled={isPending}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && (
            <span className="ml-2">
              {isPending ? "Creating..." : "New Form"}
            </span>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                item.current
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="ml-3 flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "ml-auto text-xs",
                        item.current
                          ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
                          : "bg-sidebar-accent/20 text-sidebar-accent"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </a>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-sidebar-primary/10 to-sidebar-accent/10 rounded-lg p-4 border border-sidebar-border">
            <div className="flex items-center mb-2">
              <Zap className="h-4 w-4 text-sidebar-accent mr-2" />
              <span className="text-sm font-medium text-sidebar-foreground">
                Upgrade to Pro
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock advanced features and unlimited forms
            </p>
            <Button
              size="sm"
              className="w-full bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-accent-foreground"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border p-4 space-y-1">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                item.current
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </a>
          );
        })}

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center px-3 py-2 rounded-lg hover:bg-sidebar-accent/10 cursor-pointer transition-colors",
            isCollapsed && "justify-center"
          )}
        >
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <span className="text-sidebar-accent-foreground font-medium text-sm">
              {/* Use initials from Clerk user or fallback */}
              {user
                ? (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
                : "JD"}
            </span>
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {/* Use Clerk user full name or fallback */}
                {user
                  ? user.fullName ||
                    user.username ||
                    user.primaryEmailAddress?.emailAddress
                  : "John Doe"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {/* Use Clerk user email or fallback */}
                {user
                  ? user.primaryEmailAddress?.emailAddress ||
                    user.emailAddresses?.[0]?.emailAddress
                  : "john@example.com"}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <Bell className="h-4 w-4 text-muted-foreground ml-2" />
          )}
        </div>
      </div>
    </div>
  );
}
