import React, { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";

export interface SlashMenuProps {
  editor: Editor | null;
}

const SLASH_OPTIONS: {
  label: string;
  command: (editor: Editor) => void;
  match: string[];
}[] = [
  {
    label: "Heading 1",
    command: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    match: ["h1", "heading 1", "heading1"],
  },
  {
    label: "Heading 2",
    command: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    match: ["h2", "heading 2", "heading2"],
  },
  {
    label: "Bullet List",
    command: (editor: Editor) =>
      editor.chain().focus().toggleBulletList().run(),
    match: ["ul", "bullet", "list", "bullet list"],
  },
  {
    label: "Ordered List",
    command: (editor: Editor) =>
      editor.chain().focus().toggleOrderedList().run(),
    match: ["ol", "ordered", "ordered list", "numbered"],
  },
  {
    label: "Blockquote",
    command: (editor: Editor) =>
      editor.chain().focus().toggleBlockquote().run(),
    match: ["blockquote", "quote"],
  },
  {
    label: "Code Block",
    command: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
    match: ["code", "code block"],
  },
  {
    label: "Short Answer Question",
    command: (editor: Editor) =>
      editor.chain().focus().insertQuestion({ type: "short" }).run(),
    match: ["short", "short answer", "short question", "input", "text"],
  },
  {
    label: "Long Answer Question",
    command: (editor: Editor) =>
      editor.chain().focus().insertQuestion({ type: "long" }).run(),
    match: ["long", "long answer", "long question", "textarea", "paragraph"],
  },
  {
    label: "Multiple Choice Question",
    command: (editor: Editor) =>
      editor
        .chain()
        .focus()
        .insertQuestion({
          type: "multipleChoice",
          label: "Untitled multiple choice",
          options: ["Option 1", "Option 2"],
        })
        .run(),
    match: [
      "multiple",
      "multiple choice",
      "mcq",
      "choice",
      "radio",
      "checkbox",
    ],
  },
];

export const SlashMenu: React.FC<SlashMenuProps> = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Listen for / and update menu state
  useEffect(() => {
    if (!editor) return;
    const handler = () => {
      const { state } = editor;
      const { selection } = state;
      const $from = selection.$from;
      const textBefore = $from.parent.textBetween(
        0,
        $from.parentOffset,
        undefined,
        "\ufffc"
      );
      const match = textBefore.match(/\/(\w*)$/);
      if (match) {
        setOpen(true);
        setQuery(match[1] || "");
        setSelectedIndex(0);
        // Calculate position
        const dom = editor.view.domAtPos($from.pos);
        if (dom && dom.node instanceof HTMLElement) {
          const rect = dom.node.getBoundingClientRect();
          setPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          });
        } else {
          setPosition(null);
        }
      } else {
        setOpen(false);
        setQuery("");
        setPosition(null);
        setSelectedIndex(0);
      }
    };
    editor.on("transaction", handler);
    return () => {
      editor.off("transaction", handler);
    };
  }, [editor]);

  const filteredOptions = SLASH_OPTIONS.filter(
    (opt) =>
      !query ||
      opt.label.toLowerCase().includes(query.toLowerCase()) ||
      (opt.match &&
        opt.match.some((m: string) => m.includes(query.toLowerCase())))
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredOptions.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((i) => (i + 1) % filteredOptions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex(
          (i) => (i - 1 + filteredOptions.length) % filteredOptions.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (filteredOptions[selectedIndex] && editor) {
          // Remove the /query from the editor
          const { state } = editor;
          const { selection } = state;
          const $from = selection.$from;
          const textBefore = $from.parent.textBetween(
            0,
            $from.parentOffset,
            undefined,
            "\ufffc"
          );
          const match = textBefore.match(/\/(\w*)$/);
          if (match) {
            const from = $from.start() + match.index!;
            const to = $from.pos;
            editor.commands.deleteRange({ from, to });
          }
          filteredOptions[selectedIndex].command(editor);
          setOpen(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredOptions, selectedIndex, editor]);

  if (!open || !position) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        padding: 8,
        zIndex: 1000,
        minWidth: 180,
      }}
    >
      <div>
        <b>Slash Menu</b>
      </div>
      <div>Query: {query}</div>
      <div style={{ marginTop: 8 }}>
        {filteredOptions.length === 0 ? (
          <div style={{ color: "#888", padding: "4px 8px" }}>No results</div>
        ) : (
          filteredOptions.map((opt, idx) => (
            <div
              key={opt.label}
              style={{
                padding: "4px 8px",
                cursor: "pointer",
                borderRadius: 3,
                marginBottom: 2,
                background: idx === selectedIndex ? "#e6f0ff" : undefined,
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                if (editor) {
                  const { state } = editor;
                  const { selection } = state;
                  const $from = selection.$from;
                  const textBefore = $from.parent.textBetween(
                    0,
                    $from.parentOffset,
                    undefined,
                    "\ufffc"
                  );
                  const match = textBefore.match(/\/(\w*)$/);
                  if (match) {
                    const from = $from.start() + match.index!;
                    const to = $from.pos;
                    editor.commands.deleteRange({ from, to });
                  }
                  opt.command(editor);
                }
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
