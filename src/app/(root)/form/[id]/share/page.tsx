"use client";
import { Tabs } from "@/components/ui/tabs";
import React, { useState } from "react";

export default function SharePage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/s/${params.id}`
      : `/s/${params.id}`;

  const tabs = [
    { label: "Summary", href: `/form/${params.id}/summary` },
    { label: "Responses", href: `/form/${params.id}/responses` },
    { label: "Share", href: `/form/${params.id}/share` },
    { label: "Integration", href: `/form/${params.id}/integration` },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Show "Copied!" for 2 seconds
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Tabs tabs={tabs} />
      <h1 className="text-2xl font-bold mb-4">Share</h1>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="border rounded px-2 py-1 w-full max-w-xs"
        />
        <button
          type="button"
          className={`px-3 py-1 rounded ${
            copied
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
