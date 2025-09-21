import React from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { DragHandleButton } from "../DragHandleButton"; // adjust path if needed
import { QuestionNodeWrapper } from "./questionNodeWrapper";
import "./question-node.css"; // (create this file for styles if not present)

export default function QuestionNodeComponent({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const { label, type, placeholder } = node.attrs;

  const openSettings = () => {
    updateAttributes({ openSettings: true });
  };

  return (
    <QuestionNodeWrapper
      node={node}
      updateAttributes={updateAttributes}
      onOpenSettings={openSettings}
    >
      <input
        type="text"
        className="block w-full text-lg font-medium mb-2 bg-transparent border-none focus:ring-0 p-0 no-border"
        value={label}
        placeholder="Question prompt..."
        onChange={(e) => updateAttributes({ label: e.target.value })}
      />

      {type === "short" && (
        <input
          type="text"
          className="block w-full border border-gray-300 rounded px-2 py-1 text-base mt-2"
          value={placeholder}
          placeholder="Placeholder (optional)"
          onChange={(e) => updateAttributes({ placeholder: e.target.value })}
        />
      )}
      {type === "long" && (
        <textarea
          className="block w-full border border-gray-300 rounded px-2 py-1 text-base mt-2 resize-none"
          value={placeholder}
          placeholder="Placeholder (optional)"
          onChange={(e) => updateAttributes({ placeholder: e.target.value })}
          rows={3}
        />
      )}
    </QuestionNodeWrapper>
  );
}
