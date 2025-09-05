import { getUserSubmissions } from "@/app/actions/form";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";

export default async function ResponsesPage({
  params,
}: {
  params: { id: string };
}) {
  const formId = params.id;
  const submissions = await getUserSubmissions(formId);

  const tabs = [
    { label: "Summary", href: `/form/${formId}/summary` },
    { label: "Responses", href: `/form/${formId}/responses` },
    { label: "Share", href: `/form/${formId}/share` },
    { label: "Integration", href: `/form/${formId}/integration` },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Tabs tabs={tabs} />
      <h1 className="text-2xl font-bold mb-6">Your Responses</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Form Title</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No responses found.
              </TableCell>
            </TableRow>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            submissions.map((submission: any) => (
              <TableRow key={submission.id}>
                <TableCell>
                  {submission.document?.title || "Untitled"}
                </TableCell>
                <TableCell>
                  {new Date(submission.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/form/${submission.documentId}/responses/${submission.id}`}
                  >
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
