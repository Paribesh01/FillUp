"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  label: string;
  href: string;
}

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();
  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 -mb-px border-b-2 ${
              isActive
                ? "border-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
