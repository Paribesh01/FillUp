"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Code, Mail } from "lucide-react";

// Remove the mock formData

export default function FormSharePage({ params }: { params: { id: string } }) {
  const shareUrl = `http://localhost:3000/s/${params.id}`;
  const embedCode = `<iframe src="http://localhost:3000/embed/${params.id}" width="100%" height="600"></iframe>`;

  // Optional: show feedback when copied
  const [copied, setCopied] = useState<"share" | "embed" | null>(null);

  const handleCopy = (text: string, type: "share" | "embed") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Share Link
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(shareUrl, "share")}
          >
            <Link2 className="h-4 w-4 mr-2" />
            {copied === "share" ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Share this link to collect responses from your audience
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Embed Code
        </h3>
        <div className="bg-background border border-border rounded-lg p-4 mb-4">
          <code className="text-sm text-foreground font-mono break-all">
            {embedCode}
          </code>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCopy(embedCode, "embed")}
        >
          <Code className="h-4 w-4 mr-2" />
          {copied === "embed" ? "Copied!" : "Copy Embed Code"}
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Social Sharing
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" size="sm">
            Share on Twitter
          </Button>
          <Button variant="outline" size="sm">
            Share on LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
}
