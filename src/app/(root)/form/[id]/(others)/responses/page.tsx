import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import Link from "next/link";
import { getAllSubmissionsForForm } from "@/app/actions/form";

export default async function FormResponsesPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch real submissions from the database
  const submissions = await getAllSubmissionsForForm(params.id);

  // Map submissions to the structure expected by your table
  const responses = submissions.map((submission: any) => ({
    id: submission.id,
    submittedAt: submission.createdAt,
    email: submission.userId, // You may want to join with user table for real email
    status: "completed", // You may want to add a status field in your model
    fields: submission.content, // Assuming content is { name, company, ... }
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

      <div className="bg-card border border-border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Response ID
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Submitted
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Email
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Company
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr
                  key={response.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/50"
                >
                  <td className="p-4">
                    <Link
                      href={`/form/${params.id}/responses/${response.id}`}
                      className="text-primary hover:underline font-mono text-sm"
                    >
                      {response.id}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatDate(response.submittedAt)}
                  </td>
                  <td className="p-4 text-sm">{response.email}</td>
                  <td className="p-4 text-sm">{response.fields.name}</td>
                  <td className="p-4 text-sm">
                    {response.fields.company || "-"}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        response.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {response.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/form/${params.id}/responses/${response.id}`}
                      >
                        View
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
