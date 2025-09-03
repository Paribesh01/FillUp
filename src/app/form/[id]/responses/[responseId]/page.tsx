import prisma from "@/app/db";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function ResponseDetailPage({
  params,
}: {
  params: { id: string; responseId: string };
}) {
  const user = await currentUser();
  if (!user) return <div>Not signed in</div>;

  const submission = await prisma.submission.findUnique({
    where: { id: params.responseId, userId: user.id },
    include: { document: { select: { title: true } } },
  });

  if (!submission) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Response to: {submission.document?.title || "Untitled"}
      </h1>
      <div className="mb-2 text-muted-foreground">
        Submitted at: {new Date(submission.createdAt).toLocaleString()}
      </div>
      <div className="bg-gray-100 rounded p-4 overflow-x-auto">
        <pre className="whitespace-pre-wrap break-words text-sm">
          {JSON.stringify(submission.content, null, 2)}
        </pre>
      </div>
    </div>
  );
}
