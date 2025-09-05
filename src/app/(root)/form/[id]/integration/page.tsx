import { Tabs } from "@/components/ui/tabs";

export default function IntegrationPage({
  params,
}: {
  params: { id: string };
}) {
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
      <div>Integration options coming soon.</div>
    </div>
  );
}
