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
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
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
import { updateFormContent } from "@/app/actions/form"; // Import your server action

export function SimpleEditor({
  docId,
  initialContent,
}: {
  docId: string;
  initialContent: any;
}) {
  const isMobile = useIsMobile();

  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");

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
      HorizontalRule,
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
          return ReactNodeViewRenderer(QuestionNodeComponent);
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

  // Save on every change
  React.useEffect(() => {
    if (!editor) return;
    const saveContent = async () => {
      const json = editor.getJSON();
      // Debounce or throttle if needed
      await updateFormContent(docId, json);
    };
    editor.on("update", saveContent);
    return () => {
      editor.off("update", saveContent);
    };
  }, [editor, docId]);

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
        <SlashMenu editor={editor} />
      </EditorContext.Provider>
    </div>
  );
}
