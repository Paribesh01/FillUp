import prisma from "@/app/db";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import { currentUser } from "@clerk/nextjs/server";

export default async function FormPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return <div>Not signed in</div>;

  const doc = await prisma.document.findUnique({
    where: { id: params.id, userId: user.id },
  });

  if (!doc) return <div>Form not found</div>;

  return <SimpleEditor docId={doc.id} initialContent={doc.content} />;
}
