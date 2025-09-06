import { Button } from "@/components/ui/button";
import { Users, Download } from "lucide-react";

export default function FormResponsesPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          All Responses
        </h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Response data will appear here
          </h3>
          <p className="text-muted-foreground">
            Individual responses and analytics will be displayed in this section
          </p>
        </div>
      </div>
    </div>
  );
}
