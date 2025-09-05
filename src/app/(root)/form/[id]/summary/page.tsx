import { Tabs } from "@/components/ui/tabs";
import prisma from "@/app/db";
import { currentUser } from "@clerk/nextjs/server";

export default async function SummaryPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();
  if (!user) return <div>Not signed in</div>;

  const doc = await prisma.document.findUnique({
    where: { id: params.id, userId: user.id },
  });

  if (!doc) return <div>Form not found</div>;

  const tabs = [
    { label: "Summary", href: `/form/${params.id}/summary` },
    { label: "Responses", href: `/form/${params.id}/responses` },
    { label: "Share", href: `/form/${params.id}/share` },
    { label: "Integration", href: `/form/${params.id}/integration` },
  ];

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Tabs tabs={tabs} />
      <h1 className="text-2xl font-bold mb-4">{doc.title}</h1>
      <div className="mb-2 text-gray-600">
        Created: {doc.createdAt.toLocaleString()}
      </div>
      <div className="mb-2 text-gray-600">
        Published: {doc.published ? "Yes" : "No"}
      </div>
      {/* Add more summary info or a content preview here */}
    </div>
  );
}
