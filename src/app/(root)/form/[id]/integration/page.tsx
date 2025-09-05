"use client";
import { Tabs } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function IntegrationPage({
  params,
}: {
  params: { id: string };
}) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check connection status from your backend
    fetch(`/api/google-oauth/status?documentId=${params.id}`)
      .then((res) => res.json())
      .then((data) => setConnected(data.connected));
  }, [params.id]);

  const tabs = [
    { label: "Summary", href: `/form/${params.id}/summary` },
    { label: "Responses", href: `/form/${params.id}/responses` },
    { label: "Share", href: `/form/${params.id}/share` },
    { label: "Integration", href: `/form/${params.id}/integration` },
  ];
  return (
    <div className="max-w-2xl mx-auto py-10">
      <Tabs tabs={tabs} />
      <h1 className="text-2xl font-bold mb-4">Integration</h1>
      <div>
        {connected ? (
          <span className="text-green-600">Google Sheets Connected</span>
        ) : (
          <a
            href={`/api/google-oauth/start?documentId=${params.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect Google Sheets
          </a>
        )}
      </div>
    </div>
  );
}
