import React from "react";
import { useState } from "react";
import QuestionFormField from "./QuestionFormField";
import CodeBlockDisplay from "./CodeBlockDisplay";

type QuestionNodeAttrs = {
  id: string;
  type: "short" | "long" | "multipleChoice" | "checkbox";
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
  preview = false, // default to false
}: {
  docContent: any;
  documentId: string;
  title: string;
  preview?: boolean;
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
  const [form, setForm] = useState<{ [id: string]: string | string[] }>(
    Object.fromEntries(
      questions.map((q) => [q.attrs.id, q.attrs.type === "checkbox" ? [] : ""])
    )
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleChange = (id: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (preview) {
      e.preventDefault();
      return; // Do nothing in preview mode
    }
    e.preventDefault();
    setSubmitting(true);

    // Build the array of answers with all relevant fields
    const content = questions.map((q) => ({
      id: q.attrs.id,
      type: q.attrs.type,
      question: q.attrs.label,
      answer:
        q.attrs.type === "checkbox"
          ? JSON.stringify(form[q.attrs.id] || [])
          : form[q.attrs.id] || "",
      options: q.attrs.options || undefined,
      // Add more fields from q.attrs as needed
    }));

    await fetch("/api/sumbit-form", {
      method: "POST",
      body: JSON.stringify({ documentId, content }),
      headers: { "Content-Type": "application/json" },
    });
    setSubmitted(true);
  };

  // Helper to render inline content with marks
  function renderContent(content: any[]) {
    if (!Array.isArray(content)) return null;
    return content.map((node, i) => {
      if (node.type === "text") {
        let el: React.ReactNode = node.text;
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            if (mark.type === "bold") {
              el = <strong key={`b${i}`}>{el}</strong>;
            }
            if (mark.type === "italic") {
              el = <em key={`i${i}`}>{el}</em>;
            }
            if (mark.type === "underline") {
              el = <u key={`u${i}`}>{el}</u>;
            }
            if (mark.type === "strike") {
              el = <s key={`s${i}`}>{el}</s>;
            }
            if (mark.type === "code") {
              el = <code key={`c${i}`}>{el}</code>;
            }
            if (mark.type === "highlight") {
              el = (
                <span
                  key={`h${i}`}
                  style={{
                    background: mark.attrs?.color || "#ffe066",
                    borderRadius: 2,
                    padding: "0 2px",
                  }}
                >
                  {el}
                </span>
              );
            }
            if (mark.type === "link") {
              el = (
                <a
                  key={`l${i}`}
                  href={mark.attrs?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  {el}
                </a>
              );
            }
            if (mark.type === "subscript") {
              el = <sub key={`sub${i}`}>{el}</sub>;
            }
            if (mark.type === "superscript") {
              el = <sup key={`sup${i}`}>{el}</sup>;
            }
          });
        }
        return <React.Fragment key={i}>{el}</React.Fragment>;
      }
      // If nested content (e.g., for hard breaks, inline images, etc.)
      if (node.type === "hardBreak") {
        return <br key={i} />;
      }
      // Add more inline node types as needed
      return null;
    });
  }

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
      {submitted ? (
        <div
          style={{
            background: "#fff",
            padding: 32,
            borderRadius: 12,
            minWidth: 340,
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
          }}
        >
          <h2>Thank you for your submission!</h2>
          <p>We have received your response.</p>
        </div>
      ) : (
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
            if (isParagraphNode(node)) {
              if (!node.content) return null;
              return (
                <p
                  key={idx}
                  style={{
                    textAlign: node.attrs?.textAlign || "left",
                    margin: "12px 0",
                    color: "#444",
                  }}
                >
                  {renderContent(node.content)}
                </p>
              );
            }
            // Handle headings
            if (node.type && node.type.startsWith("heading")) {
              const level = node.attrs?.level || 1;
              if (!node.content) return null;
              const Tag = `h${level}` as keyof JSX.IntrinsicElements;
              return (
                <Tag
                  key={idx}
                  style={{
                    margin: "18px 0 8px 0",
                    fontWeight: 700,
                    fontSize: 20 + (6 - Math.min(level, 6)) * 2,
                  }}
                >
                  {renderContent(node.content)}
                </Tag>
              );
            }
            // Handle images
            if (node.type === "image" && node.attrs?.src) {
              return (
                <img
                  key={idx}
                  src={node.attrs.src}
                  alt={node.attrs.alt || ""}
                  style={{
                    maxWidth: "100%",
                    margin: "16px 0",
                    borderRadius: 8,
                  }}
                />
              );
            }
            // Handle blockquotes
            if (node.type === "blockquote") {
              if (!node.content) return null;
              return (
                <blockquote
                  key={idx}
                  style={{
                    borderLeft: "4px solid #ddd",
                    margin: "12px 0",
                    padding: "8px 16px",
                    color: "#666",
                    fontStyle: "italic",
                    background: "#fafafa",
                  }}
                >
                  {renderContent(node.content)}
                </blockquote>
              );
            }
            // Handle horizontal rule
            if (node.type === "horizontalRule") {
              return <hr key={idx} style={{ margin: "18px 0" }} />;
            }
            // Handle lists (bullet and ordered)
            if (node.type === "bulletList" || node.type === "orderedList") {
              const isOrdered = node.type === "orderedList";
              const items = Array.isArray(node.content) ? node.content : [];
              return isOrdered ? (
                <ol key={idx} style={{ margin: "12px 0 12px 24px" }}>
                  {items.map((li: any, liIdx: number) => (
                    <li key={liIdx}>{renderContent(li.content)}</li>
                  ))}
                </ol>
              ) : (
                <ul key={idx} style={{ margin: "12px 0 12px 24px" }}>
                  {items.map((li: any, liIdx: number) => (
                    <li key={liIdx}>{renderContent(li.content)}</li>
                  ))}
                </ul>
              );
            }
            // Handle task lists (checkbox lists)
            if (node.type === "taskList") {
              const items = Array.isArray(node.content) ? node.content : [];
              return (
                <ul
                  key={idx}
                  style={{
                    margin: "12px 0 12px 24px",
                    listStyle: "none",
                    padding: 0,
                  }}
                >
                  {items.map((li: any, liIdx: number) => (
                    <li key={liIdx}>
                      <input
                        type="checkbox"
                        checked={!!li.attrs?.checked}
                        readOnly
                      />{" "}
                      {renderContent(li.content)}
                    </li>
                  ))}
                </ul>
              );
            }
            // Optionally handle more node types as needed...
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
                disabled={preview || submitting}
                style={preview ? { opacity: 0.5, pointerEvents: "none" } : {}}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
