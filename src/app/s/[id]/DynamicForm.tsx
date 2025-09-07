"use client";
import { useState } from "react";
import QuestionFormField from "./QuestionFormField";
import CodeBlockDisplay from "./CodeBlockDisplay";

type QuestionNodeAttrs = {
  id: string;
  type: "short" | "long" | "multipleChoice";
  label: string;
  answer: string;
  placeholder: string;
  options?: string[];
};

type Node =
  | { type: "questionNode"; attrs: QuestionNodeAttrs }
  | {
      type: "codeBlock";
      attrs: { language: string | null };
      content: { text: string }[];
    }
  | { type: "paragraph"; attrs: { textAlign: string | null } }
  | { type: string; [key: string]: unknown };

export default function DynamicForm({
  docContent,
  documentId,
  title,
}: {
  docContent: any;
  documentId: string;
  title: string;
}) {
  // Type guard for question nodes
  function isQuestionNode(
    node: unknown
  ): node is { type: "questionNode"; attrs: QuestionNodeAttrs } {
    return (
      typeof node === "object" &&
      node !== null &&
      (node as { type?: unknown }).type === "questionNode" &&
      typeof (node as { attrs?: unknown }).attrs === "object" &&
      (node as { attrs?: unknown }).attrs !== null
    );
  }

  // Type guard for code block nodes
  function isCodeBlockNode(node: unknown): node is {
    type: "codeBlock";
    attrs: { language: string | null };
    content: { text: string }[];
  } {
    return (
      typeof node === "object" &&
      node !== null &&
      (node as { type?: unknown }).type === "codeBlock"
    );
  }

  // Type guard for paragraph nodes
  function isParagraphNode(
    node: unknown
  ): node is { type: "paragraph"; attrs: { textAlign: string | null } } {
    return (
      typeof node === "object" &&
      node !== null &&
      (node as { type?: unknown }).type === "paragraph"
    );
  }

  // Type guard for nextPage nodes
  function isNextPageNode(node: unknown): node is { type: "nextPage" } {
    return (
      typeof node === "object" &&
      node !== null &&
      (node as { type?: unknown }).type === "nextPage"
    );
  }

  const contentArray = Array.isArray(docContent.content)
    ? docContent.content
    : [];
  const questions = contentArray.filter(isQuestionNode);
  const [form, setForm] = useState<{ [id: string]: string }>(
    Object.fromEntries(questions.map((q) => [q.attrs.id, ""]))
  );
  const [submitting, setSubmitting] = useState(false);

  // --- Pagination logic ---
  // Split content into pages by nextPage nodes
  const pages: unknown[][] = [];
  let currentPage: unknown[] = [];
  contentArray.forEach((node) => {
    if (isNextPageNode(node)) {
      pages.push(currentPage);
      currentPage = [];
    } else {
      currentPage.push(node);
    }
  });
  if (currentPage.length > 0 || pages.length === 0) {
    pages.push(currentPage);
  }
  const [pageIdx, setPageIdx] = useState(0);
  const isFirstPage = pageIdx === 0;
  const isLastPage = pageIdx === pages.length - 1;

  const handleChange = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Build the array of answers with all relevant fields
    const content = questions.map((q) => ({
      id: q.attrs.id,
      type: q.attrs.type,
      question: q.attrs.label,
      answer: form[q.attrs.id] || "",
      options: q.attrs.options || undefined, // Only include if present
      // Add more fields from q.attrs as needed
    }));

    await fetch("/api/sumbit-form", {
      method: "POST",
      body: JSON.stringify({ documentId, content }),
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
        {pages[pageIdx].map((node, idx) => {
          if (isQuestionNode(node)) {
            return (
              <QuestionFormField
                key={node.attrs.id}
                node={node}
                value={form[node.attrs.id] || ""}
                onChange={handleChange}
              />
            );
          }
          if (isCodeBlockNode(node)) {
            return <CodeBlockDisplay key={idx} node={node} />;
          }
          // Optionally handle paragraphs, etc.
          return null;
        })}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          {!isFirstPage && (
            <button
              type="button"
              onClick={() => setPageIdx((idx) => Math.max(0, idx - 1))}
              style={{
                padding: "10px 18px",
                borderRadius: 6,
                background: "#eee",
                color: "#333",
                fontWeight: 500,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
              }}
            >
              Previous
            </button>
          )}
          {!isLastPage && (
            <button
              type="button"
              onClick={() =>
                setPageIdx((idx) => Math.min(pages.length - 1, idx + 1))
              }
              style={{
                marginLeft: isFirstPage ? 0 : 12,
                padding: "10px 18px",
                borderRadius: 6,
                background: "#222",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          )}
          {isLastPage && (
            <button
              type="submit"
              disabled={submitting}
              style={{
                marginLeft: isFirstPage ? 0 : 12,
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
          )}
        </div>
      </form>
    </div>
  );
}
