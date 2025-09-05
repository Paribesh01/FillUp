// src/app/dashboard/CreateFormButton.tsx

"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createForm } from "@/app/actions/form";

export default function CreateFormButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreate = () => {
    startTransition(async () => {
      const form = await createForm();
      router.push(`/form/${form.id}`);
    });
  };

  return (
    <button
      onClick={handleCreate}
      className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      disabled={isPending}
    >
      {isPending ? "Creating..." : "Create New Form"}
    </button>
  );
}
