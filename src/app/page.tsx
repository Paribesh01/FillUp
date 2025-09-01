"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

import { useEffect } from "react";
import { createForm, getUserForms } from "./actions/form";

export default function Home() {
  const router = useRouter();
  const [forms, setForms] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  // Fetch forms on mount
  useEffect(() => {
    startTransition(async () => {
      const data = await getUserForms();
      setForms(data);
    });
  }, []);

  // Create a new form and redirect
  const handleCreateForm = async () => {
    startTransition(async () => {
      const doc = await createForm();
      router.push(`/form/${doc.id}`);
    });
  };

  return (
    <div>
      <button onClick={handleCreateForm} disabled={isPending}>
        {isPending ? "Creating..." : "New Form"}
      </button>
      <h2>Your Forms</h2>
      <ul>
        {forms.map((form) => (
          <li key={form.id}>
            <a href={`/form/${form.id}`}>{form.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
