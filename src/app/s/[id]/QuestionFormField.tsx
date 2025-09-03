import React from "react";

type QuestionNodeAttrs = {
  id: string;
  type: "short" | "long";
  label: string;
  answer: string;
  placeholder: string;
};

export default function QuestionFormField({
  node,
  value,
  onChange,
}: {
  node: { attrs: QuestionNodeAttrs };
  value: string;
  onChange: (id: string, value: string) => void;
}) {
  const { id, type, label, placeholder } = node.attrs;

  return (
    <div
      className="question-node rounded-md p-4 my-4 bg-white"
      style={{
        minWidth: 240,
        marginBottom: 20,
      }}
    >
      <label
        style={{
          display: "block",
          fontWeight: 500,
          fontSize: 18,
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {type === "short" ? (
        <input
          type="text"
          className="block w-full border border-gray-300 rounded px-2 py-1 text-base"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
          required
          style={{ marginTop: 4 }}
        />
      ) : (
        <textarea
          className="block w-full border border-gray-300 rounded px-2 py-1 text-base resize-none"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
          required
          rows={3}
          style={{ marginTop: 4 }}
        />
      )}
    </div>
  );
}
