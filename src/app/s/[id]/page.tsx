import prisma from "@/app/db";
import { currentUser } from "@clerk/nextjs/server";
import DynamicForm from "./DynamicForm";

export default async function SubmitFormPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();
  if (!user) return <div>Not signed in</div>;

  const doc = await prisma.document.findUnique({
    where: { id: params.id },
  });

  if (!doc || !doc.published) return <div>Form not found or not published</div>;

  const submission = await prisma.submission.findFirst({
    where: { documentId: params.id, userId: user.id },
  });

  if (submission) {
    return (
      <div>
        <h2>Your Submission</h2>
        <pre>{JSON.stringify(submission.content, null, 2)}</pre>
      </div>
    );
  }

  return (
    <DynamicForm
      docContent={doc.content}
      documentId={doc.id}
      title={doc.title}
    />
  );
}
