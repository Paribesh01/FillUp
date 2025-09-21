import React, { useEffect } from "react";
import { DragHandleButton } from "../DragHandleButton"; // adjust path
import { QuestionNodeWrapper } from "./questionNodeWrapper";

export default function CheckboxQuestionNode({
  node,
  updateAttributes,
  selected,
}: any) {
  const attrs = node.attrs;
  const options: string[] = attrs.options || [];
  const answer: string[] = attrs.answer ? JSON.parse(attrs.answer) : [];

  // Ensure options array exists in node attributes
  useEffect(() => {
    if (
      !attrs.options ||
      !Array.isArray(attrs.options) ||
      attrs.options.length === 0
    ) {
      updateAttributes({ options: ["Option 1", "Option 2"] });
    }
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAttributes({ label: e.target.value });
  };

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...(options || [])];
    newOptions[idx] = value;
    updateAttributes({ options: newOptions });
  };

  const handleAddOption = () => {
    updateAttributes({
      options: [...(options || []), `Option ${options.length + 1}`],
    });
  };

  const handleRemoveOption = (idx: number) => {
    const newOptions = (options || []).filter((_, i) => i !== idx);
    updateAttributes({ options: newOptions });
  };

  const handleCheckboxChange = (option: string) => {
    let newAnswer: string[];
    if (answer.includes(option)) {
      newAnswer = answer.filter((a) => a !== option);
    } else {
      newAnswer = [...answer, option];
    }
    updateAttributes({ answer: JSON.stringify(newAnswer) });
  };

  const openSettings = () => {
    updateAttributes({ openSettings: true });
  };

  return (
    <QuestionNodeWrapper onOpenSettings={openSettings}>
      <div style={{ width: "100%" }}>
        <input
          value={attrs.label || ""}
          onChange={(e) => updateAttributes({ label: e.target.value })}
          placeholder="Question label"
          style={{ width: "100%", marginBottom: 8, fontWeight: 600 }}
          className="block w-full text-lg font-medium mb-2 bg-transparent border-none focus:ring-0 p-0 no-border"
        />
        <div>
          {options.map((option: string, idx: number) => (
            <div
              key={idx}
              style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
            >
              <input
                type="checkbox"
                checked={answer.includes(option)}
                onChange={() => {
                  let newAnswer: string[];
                  if (answer.includes(option)) {
                    newAnswer = answer.filter((a) => a !== option);
                  } else {
                    newAnswer = [...answer, option];
                  }
                  updateAttributes({ answer: JSON.stringify(newAnswer) });
                }}
                style={{ marginRight: 8 }}
              />
              <input
                value={option}
                onChange={(e) =>
                  updateAttributes({
                    options: [
                      ...options.slice(0, idx),
                      e.target.value,
                      ...options.slice(idx + 1),
                    ],
                  })
                }
                placeholder={`Option ${idx + 1}`}
                style={{
                  flex: 1,
                  border: selected ? "2px solid #0070f3" : "1px solid #ccc",
                  marginRight: 8,
                }}
              />
              <button
                type="button"
                onClick={() =>
                  updateAttributes({
                    options: options.filter((_, i) => i !== idx),
                  })
                }
                disabled={options.length <= 1}
                style={{ marginLeft: 4 }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updateAttributes({
                options: [...options, `Option ${options.length + 1}`],
              })
            }
            style={{ marginTop: 6 }}
          >
            Add Option
          </button>
        </div>
      </div>
    </QuestionNodeWrapper>
  );
}
