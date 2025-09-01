import React from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

export default function QuestionNodeComponent({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const { label, type, placeholder } = node.attrs;

  return (
    <NodeViewWrapper
      className={`question-node rounded-md p-4 my-4 bg-white`}
      style={{ minWidth: 240 }}
    >
      {/* Editable label (question prompt) */}
      <input
        type="text"
        className="block w-full text-lg font-medium mb-2 bg-transparent border-none focus:ring-0 p-0 no-border"
        value={label}
        placeholder="Question prompt..."
        onChange={(e) => updateAttributes({ label: e.target.value })}
      />

      {/* Placeholder input for the creator to set the placeholder text */}
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
    </NodeViewWrapper>
  );
}
