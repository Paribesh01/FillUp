"use client";
import { useState } from "react";

type QuestionNodeAttrs = {
  id: string;
  type: "short" | "long";
  label: string;
  answer: string;
  placeholder: string;
};

type Node =
  | { type: "questionNode"; attrs: QuestionNodeAttrs }
  | {
      type: "codeBlock";
      attrs: { language: string | null };
      content: { text: string }[];
    }
  | { type: "paragraph"; attrs: { textAlign: string | null } }
  | { type: string; [key: string]: any };

export default function DynamicForm({
  docContent,
  documentId,
}: {
  docContent: any;
  documentId: string;
}) {
  // Extract all question nodes for form state
  const questions = (docContent.content || []).filter(
    (node: Node) => node.type === "questionNode"
  );
  const [form, setForm] = useState<{ [id: string]: string }>(
    Object.fromEntries(questions.map((q: any) => [q.attrs.id, ""]))
  );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/sumbit-form", {
      method: "POST",
      body: JSON.stringify({ documentId, content: form }),
      headers: { "Content-Type": "application/json" },
    });
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit}>
      {(docContent.content || []).map((node: Node, idx: number) => {
        if (node.type === "questionNode") {
          const { id, type, label, placeholder } = node.attrs;
          return (
            <div key={id} style={{ marginBottom: 16 }}>
              <label>
                {label}
                {type === "short" ? (
                  <input
                    type="text"
                    name={id}
                    placeholder={placeholder}
                    value={form[id] || ""}
                    onChange={(e) => handleChange(id, e.target.value)}
                    required
                  />
                ) : (
                  <textarea
                    name={id}
                    placeholder={placeholder}
                    value={form[id] || ""}
                    onChange={(e) => handleChange(id, e.target.value)}
                    required
                  />
                )}
              </label>
            </div>
          );
        }
        if (node.type === "codeBlock") {
          return (
            <pre
              key={idx}
              style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}
            >
              {node.content?.map((c: any) => c.text).join("")}
            </pre>
          );
        }
        if (node.type === "paragraph") {
          // Optionally render paragraphs (if they have text)
          return null;
        }
        return null;
      })}
      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
