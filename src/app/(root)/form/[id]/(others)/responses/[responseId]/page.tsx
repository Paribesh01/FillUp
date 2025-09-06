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

  // Fetch submission and form content
  const submission = await prisma.submission.findUnique({
    where: { id: params.responseId, userId: user.id },
    include: { document: { select: { title: true, content: true } } },
  });

  if (!submission) return notFound();

  // Extract question labels from form content
  const questionLabels: Record<string, string> = {};
  const docContent = submission.document?.content;
  function hasContentProp(obj: unknown): obj is { content: unknown } {
    return typeof obj === "object" && obj !== null && "content" in obj;
  }
  if (hasContentProp(docContent) && Array.isArray(docContent.content)) {
    for (const node of docContent.content) {
      if (
        node &&
        typeof node === "object" &&
        node.type === "questionNode" &&
        node.attrs &&
        typeof node.attrs.id === "string"
      ) {
        questionLabels[node.attrs.id] = node.attrs.label || node.attrs.id;
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Response to: {submission.document?.title || "Untitled"}
      </h1>
      <div className="mb-2 text-muted-foreground">
        <div>
          Submitted at: {new Date(submission.createdAt).toLocaleString()}
        </div>
        <div>
          User ID: <span className="font-mono">{submission.userId}</span>
        </div>
      </div>
      <div className="bg-gray-100 rounded p-4 overflow-x-auto">
        <ul className="whitespace-pre-wrap break-words text-sm">
          {submission.content &&
            Object.entries(submission.content).map(([questionId, answer]) => (
              <li key={questionId} style={{ marginBottom: 8 }}>
                <span className="font-semibold">
                  {questionLabels[questionId] || questionId}:
                </span>{" "}
                {String(answer)}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
