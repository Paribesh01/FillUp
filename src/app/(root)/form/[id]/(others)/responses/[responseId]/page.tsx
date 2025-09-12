import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Trash2,
  Flag,
  Calendar,
  Clock,
  User,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { getSubmissionById } from "@/app/actions/form";

export default async function ResponseDetailPage({
  params,
}: {
  params: { id: string; responseId: string };
}) {
  const submission = await getSubmissionById(params.responseId);

  console.log("----", submission?.content);

  if (!submission) {
    return <div>Response not found.</div>;
  }

  // Map fields as needed
  const response = {
    id: submission.id,
    submittedAt: submission.createdAt,
    status: "completed", // or whatever you want to show
    flagged: false, // unless you add this to your schema
    submitter: {
      email: "N/A", // If you have email info elsewhere, use it
      ip: "N/A",
      userAgent: "N/A",
    },
    fields: Array.isArray(submission.content)
      ? submission.content.map((field) => ({
          id: field.id,
          label: field.question,
          type: field.type,
          value: field.answer,
          options: field.options || [],
          required: false, // or true if you have that info
        }))
      : [],
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "text":
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/form/${params.id}/responses`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Responses
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">
              Response #{response.id}
            </h1>
            <p className="text-muted-foreground">
              Submitted {formatDate(response.submittedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4 mr-2" />
            Flag
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Response Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Response Status
              </h3>
              <Badge
                variant={
                  response.status === "completed" ? "default" : "secondary"
                }
              >
                {response.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Submitted:</span>
                <span className="text-card-foreground">
                  {formatDate(response.submittedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Time to complete:</span>
                <span className="text-card-foreground">2m 34s</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">
              Form Responses
            </h3>
            <div className="space-y-6">
              {response.fields.map((field) => (
                <div
                  key={field.id}
                  className="border-b border-border pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getFieldIcon(field.type)}
                    <label className="text-sm font-medium text-card-foreground">
                      {field.label}
                      {field.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </label>
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    {field.type === "checkbox" ? (
                      <span className="text-card-foreground">
                        {field.value ? "✓ Yes" : "✗ No"}
                      </span>
                    ) : field.type === "multipleChoice" ? (
                      <span className="text-card-foreground">
                        {field.value}
                      </span>
                    ) : field.type === "textarea" ? (
                      <p className="text-card-foreground whitespace-pre-wrap">
                        {field.value}
                      </p>
                    ) : (
                      <span className="text-card-foreground">
                        {field.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submitter Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Submitter Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="text-card-foreground">
                  {response.submitter.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">IP Address:</span>
                <span className="text-card-foreground font-mono">
                  {response.submitter.ip}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground">User Agent:</span>
                  <p className="text-card-foreground text-xs mt-1 break-all">
                    {response.submitter.userAgent}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Response
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag as Spam
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Response
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
