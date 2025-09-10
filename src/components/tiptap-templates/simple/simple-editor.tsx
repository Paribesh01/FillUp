"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { Placeholder } from "@tiptap/extensions";
import DragHandle from "@tiptap/extension-drag-handle";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { NextPageNode } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile";

// --- Components ---
import { SlashMenu } from "./SlashMenu";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

import { QuestionNode } from "@/components/custom/question-node/question-node-extension";
import QuestionNodeComponent from "@/components/custom/question-node/question-node";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { updateFormTitle } from "@/app/actions/form";
import { TitleInput } from "@/components/ui/title-input";
import { getFormById } from "@/app/actions/form";
import MultipleChoiceQuestionNode from "@/components/custom/question-node/MultipleChoiceQuestionNode";
import { useState, useEffect, useCallback } from "react";
import { togglePublish } from "@/app/actions/form";
import CheckboxQuestionNode from "@/components/custom/question-node/CheckboxQuestionNode";

export function SimpleEditor({
  docId,
  initialContent,
}: {
  docId: string;
  initialContent: Record<string, any>;
}) {
  const isMobile = useIsMobile();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);

  // Fetch the title and published state on mount
  useEffect(() => {
    async function fetchDoc() {
      if (docId) {
        const doc = await getFormById(docId);
        if (doc?.title) setTitle(doc.title);
        if (typeof doc?.published === "boolean") setPublished(doc.published);
      }
    }
    fetchDoc();
  }, [docId]);

  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    content: initialContent,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      NextPageNode,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      QuestionNode.extend({
        addNodeView() {
          return (props) => {
            if (props.node.attrs.type === "multipleChoice") {
              return ReactNodeViewRenderer(MultipleChoiceQuestionNode)(props);
            }
            if (props.node.attrs.type === "checkbox") {
              return ReactNodeViewRenderer(CheckboxQuestionNode)(props);
            }
            return ReactNodeViewRenderer(QuestionNodeComponent)(props);
          };
        },
      }),
      Placeholder.configure({
        placeholder: "Use / command to ...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      DragHandle.configure({
        // handle: '<span>::</span>', // optional
      }),
    ],
  });

  // Add this save handler function inside your component
  const handleSave = useCallback(async () => {
    if (!editor) return;
    setSaving(true);
    setSaved(false);
    const json = editor.getJSON();
    await fetch("/api/save-form-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId, content: json }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500); // "Saved!" disappears after 1.5s
  }, [editor, docId]);

  const handleTogglePublish = useCallback(async () => {
    // Optionally, add loading state
    await togglePublish(docId, !published);
    setPublished((prev) => !prev);
  }, [docId, published]);

  const handleTitleBlur = async () => {
    if (title.trim() && docId) {
      await updateFormTitle(docId, title.trim());
      // Optionally: show a toast or set a "saved" state
    }
  };

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <>
      <div className="w-full flex justify-center mt-8 mb-4">
        <div className="max-w-xl w-full flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleTogglePublish}
            style={{
              background: published ? "#22c55e" : "#f87171",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            disabled={saving}
          >
            {published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              background: saving ? "#a3a3a3" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontWeight: 600,
              fontSize: 15,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: saved ? "0 0 0 2px #22c55e" : "none",
              transition: "background 0.2s, box-shadow 0.2s",
              position: "relative",
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save"}
            {saved && (
              <span
                style={{
                  position: "absolute",
                  right: -60,
                  color: "#22c55e",
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                ✓
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center mb-4">
        <div className="max-w-xl w-full">
          <TitleInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Title of the form"
            aria-label="Form title"
          />
        </div>
      </div>
      <div className="simple-editor-wrapper overflow-x-auto max-w-full">
        <EditorContext.Provider value={{ editor }}>
          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content overflow-x-auto max-w-full break-words"
          />
          <SlashMenu editor={editor} />
        </EditorContext.Provider>
      </div>
    </>
  );
}
