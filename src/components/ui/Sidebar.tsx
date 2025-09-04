"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // If you have a classnames util, else use your own

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  // Remove "/forms/new" from here
  // Add more links as needed
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col py-6 px-4">
      <div className="mb-8 text-2xl font-bold">Tally</div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded hover:bg-gray-100 transition",
                  pathname === item.href ? "bg-gray-100 font-semibold" : ""
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Optionally: Add sign out/profile at the bottom */}
    </aside>
  );
}
