"use client";
import { Button } from "@/components/ui/button";
import { Webhook, Mail, BarChart3, Code } from "lucide-react";
import { useEffect, useState } from "react";

export default function FormIntegrationsPage({
  params,
}: {
  params: { id: string };
}) {
  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      const res = await fetch(
        `/api/google-oauth/status?documentId=${params.id}`
      );
      const data = await res.json();
      setGoogleConnected(data.connected);
    }
    fetchStatus();
  }, [params.id]);

  const integrations = [
    {
      name: "Webhooks",
      description: "Send form data to any URL",
      icon: Webhook,
      comingSoon: true,
    },
    {
      name: "Email Notifications",
      description: "Get notified of new responses",
      icon: Mail,
      comingSoon: true,
    },
    {
      name: "Google Sheets",
      description: "Sync responses to spreadsheet",
      icon: BarChart3,
      comingSoon: false,
      connected: googleConnected,
    },
    {
      name: "Slack",
      description: "Post notifications to Slack",
      icon: Code,
      comingSoon: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Available Integrations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                  <integration.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground">
                    {integration.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </div>
              {integration.comingSoon ? (
                <Button variant="outline" size="sm" disabled>
                  Coming soon
                </Button>
              ) : googleConnected === null ? (
                <Button variant="outline" size="sm" disabled>
                  Loading...
                </Button>
              ) : integration.name === "Google Sheets" &&
                !integration.connected ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    window.location.href = `/api/google-oauth/start?documentId=${params.id}`;
                  }}
                >
                  Connect
                </Button>
              ) : (
                <Button variant="outline" className="bg-green-500" size="sm">
                  Connected
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
