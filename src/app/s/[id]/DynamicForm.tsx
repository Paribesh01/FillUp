"use client";
import { useState } from "react";
import QuestionFormField from "./QuestionFormField";
import CodeBlockDisplay from "./CodeBlockDisplay";

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
  title,
}: {
  docContent: any;
  documentId: string;
  title: string;
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9f9f9",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 12,
          minWidth: 340,
          maxWidth: 480,
          width: "100%",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 28,
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        {(docContent.content || []).map((node: Node, idx: number) => {
          if (node.type === "questionNode") {
            return (
              <QuestionFormField
                key={node.attrs.id}
                node={node}
                value={form[node.attrs.id] || ""}
                onChange={handleChange}
              />
            );
          }
          if (node.type === "codeBlock") {
            return <CodeBlockDisplay key={idx} node={node} />;
          }
          // Optionally handle paragraphs, etc.
          return null;
        })}
        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "12px 0",
            borderRadius: 6,
            background: "#222",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
