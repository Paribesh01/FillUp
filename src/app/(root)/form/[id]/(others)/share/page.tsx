import { Button } from "@/components/ui/button";
import { Link2, Code, Mail } from "lucide-react";

// Mock form data
const formData = {
  shareUrl: "https://formcraft.app/f/customer-feedback-survey",
  embedCode: `<iframe src="https://formcraft.app/embed/customer-feedback-survey" width="100%" height="600"></iframe>`,
};

export default function FormSharePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Share Link
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={formData.shareUrl}
            readOnly
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground"
          />
          <Button variant="outline" size="sm">
            <Link2 className="h-4 w-4 mr-2" />
            Copy
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
            {formData.embedCode}
          </code>
        </div>
        <Button variant="outline" size="sm">
          <Code className="h-4 w-4 mr-2" />
          Copy Embed Code
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
