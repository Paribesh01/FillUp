import React, { useEffect } from "react";
import { DragHandleButton } from "../DragHandleButton"; // adjust path
import { QuestionNodeWrapper } from "./questionNodeWrapper";

export default function MultipleChoiceQuestionNode({
  node,
  updateAttributes,
  selected,
  editor,
  getPos,
}: any) {
  const attrs = node.attrs;

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

  const handleLabelChange = (e: any) => {
    updateAttributes({ label: e.target.value });
  };

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...(attrs.options || [])];
    newOptions[idx] = value;
    updateAttributes({ options: newOptions });
  };

  const handleAddOption = () => {
    updateAttributes({
      options: [...(attrs.options || []), `Option ${attrs.options.length + 1}`],
    });
  };

  const handleRemoveOption = (idx: number) => {
    const newOptions = (attrs.options || []).filter(
      (_: any, i: number) => i !== idx
    );
    updateAttributes({ options: newOptions as string[] });
  };

  const options = attrs.options || [];

  const openSettings = () => {
    updateAttributes({ openSettings: true });
  };

  return (
    <QuestionNodeWrapper
      onOpenSettings={openSettings}
      node={node}
      updateAttributes={updateAttributes}
      editor={editor}
      getPos={getPos}
    >
      <div style={{ width: "100%" }}>
        <input
          value={attrs.label || ""}
          onChange={handleLabelChange}
          placeholder="Question label"
          style={{ width: "100%", marginBottom: 8, fontWeight: 600 }}
        />
        <div>
          {(attrs.options || []).map((option: string, idx: number) => (
            <div
              key={idx}
              style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
            >
              <input
                value={option}
                onChange={(e) =>
                  updateAttributes({
                    options: [
                      ...(attrs.options || []).slice(0, idx),
                      e.target.value,
                      ...(attrs.options || []).slice(idx + 1),
                    ],
                  })
                }
                placeholder={`Option ${idx + 1}`}
                style={{
                  flex: 1,
                  border: selected ? "2px solid #0070f3" : "1px solid #ccc",
                }}
              />
              <button
                type="button"
                onClick={() =>
                  updateAttributes({
                    options: (attrs.options || []).filter(
                      (_: any, i: number) => i !== idx
                    ),
                  })
                }
                disabled={(attrs.options || []).length <= 1}
                style={{ marginLeft: 8 }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            style={{ marginTop: 6 }}
          >
            Add Option
          </button>
        </div>
      </div>
    </QuestionNodeWrapper>
  );
}
