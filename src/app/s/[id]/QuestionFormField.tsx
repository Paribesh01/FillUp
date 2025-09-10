import React from "react";

type QuestionNodeAttrs = {
  id: string;
  type: "short" | "long" | "multipleChoice" | "checkbox";
  label: string;
  answer: string;
  placeholder: string;
  options?: string[];
};

export default function QuestionFormField({
  node,
  value,
  onChange,
}: {
  node: { attrs: QuestionNodeAttrs };
  value: string | string[];
  onChange: (id: string, value: string | string[]) => void;
}) {
  const { id, type, label, placeholder, options } = node.attrs;

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
          value={typeof value === "string" ? value : ""}
          placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
          required
          style={{ marginTop: 4 }}
        />
      ) : type === "long" ? (
        <textarea
          className="block w-full border border-gray-300 rounded px-2 py-1 text-base resize-none"
          value={typeof value === "string" ? value : ""}
          placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
          required
          rows={3}
          style={{ marginTop: 4 }}
        />
      ) : type === "multipleChoice" && options && options.length > 0 ? (
        <div style={{ marginTop: 4 }}>
          {options.map((option, idx) => (
            <label
              key={idx}
              style={{ display: "block", marginBottom: 6, cursor: "pointer" }}
            >
              <input
                type="radio"
                name={id}
                value={option}
                checked={value === option}
                onChange={() => onChange(id, option)}
                style={{ marginRight: 8 }}
                required
              />
              {option}
            </label>
          ))}
        </div>
      ) : type === "checkbox" && options && options.length > 0 ? (
        <div style={{ marginTop: 4 }}>
          {options.map((option, idx) => {
            const checked = Array.isArray(value) && value.includes(option);
            return (
              <label
                key={idx}
                style={{ display: "block", marginBottom: 6, cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  name={id + "[]"}
                  value={option}
                  checked={checked}
                  onChange={() => {
                    let newValue: string[] = Array.isArray(value)
                      ? [...value]
                      : [];
                    if (checked) {
                      newValue = newValue.filter((v) => v !== option);
                    } else {
                      newValue.push(option);
                    }
                    onChange(id, newValue);
                  }}
                  style={{ marginRight: 8 }}
                />
                {option}
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
