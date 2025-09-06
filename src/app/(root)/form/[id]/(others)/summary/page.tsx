import { Users, Eye, BarChart3, Calendar } from "lucide-react";

// Mock form data
const formData = {
  responses: 234,
  views: 1250,
};

export default function FormSummaryPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Responses
              </p>
              <p className="text-2xl font-bold text-card-foreground">
                {formData.responses}
              </p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <p className="text-2xl font-bold text-card-foreground">
                {formData.views}
              </p>
            </div>
            <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </p>
              <p className="text-2xl font-bold text-card-foreground">18.7%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Time
              </p>
              <p className="text-2xl font-bold text-card-foreground">2m 34s</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              action: "New response received",
              time: "2 minutes ago",
              user: "john@example.com",
            },
            {
              action: "Form shared via link",
              time: "1 hour ago",
              user: "sarah@example.com",
            },
            {
              action: "Integration updated",
              time: "3 hours ago",
              user: "admin",
            },
            { action: "Form published", time: "1 day ago", user: "admin" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">{activity.user}</p>
              </div>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
