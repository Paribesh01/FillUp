"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PublishToggleButton from "./PublishToggleButton";

export type Form = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  published: boolean; // <-- Add this
};

export const columns: ColumnDef<Form>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/form/${row.original.id}/summary`}
        className="font-medium hover:underline"
      >
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString(),
  },
  {
    id: "publish",
    header: "Status",
    cell: ({ row }) => {
      const form = row.original as Form;
      console.log("form", form);
      return <PublishToggleButton id={form.id} published={form.published} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/form/${row.original.id}/responses`}>
          <Button variant="outline" size="sm">
            Responses
          </Button>
        </Link>
        <Link href={`/form/${row.original.id}`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      </div>
    ),
  },
];
