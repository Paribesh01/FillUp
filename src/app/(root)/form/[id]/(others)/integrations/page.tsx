import { Button } from "@/components/ui/button";
import { Webhook, Mail, BarChart3, Code } from "lucide-react";

export default function FormIntegrationsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Available Integrations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Webhooks",
              description: "Send form data to any URL",
              icon: Webhook,
              connected: false,
            },
            {
              name: "Email Notifications",
              description: "Get notified of new responses",
              icon: Mail,
              connected: true,
            },
            {
              name: "Google Sheets",
              description: "Sync responses to spreadsheet",
              icon: BarChart3,
              connected: false,
            },
            {
              name: "Slack",
              description: "Post notifications to Slack",
              icon: Code,
              connected: false,
            },
          ].map((integration, index) => (
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
              <Button
                variant={integration.connected ? "outline" : "default"}
                size="sm"
              >
                {integration.connected ? "Configure" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
