import React, { useEffect } from "react";

export default function MultipleChoiceQuestionNode({
  node,
  updateAttributes,
  selected,
}) {
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

  const handleLabelChange = (e) => {
    updateAttributes({ label: e.target.value });
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...(attrs.options || [])];
    newOptions[idx] = value;
    updateAttributes({ options: newOptions });
  };

  const handleAddOption = () => {
    updateAttributes({
      options: [...(attrs.options || []), `Option ${attrs.options.length + 1}`],
    });
  };

  const handleRemoveOption = (idx) => {
    const newOptions = (attrs.options || []).filter((_, i) => i !== idx);
    updateAttributes({ options: newOptions });
  };

  const options = attrs.options || [];

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 8,
        margin: 8,
      }}
    >
      <input
        value={attrs.label || ""}
        onChange={handleLabelChange}
        placeholder="Question label"
        style={{ width: "100%", marginBottom: 8, fontWeight: 600 }}
      />
      <div>
        {options.map((option, idx) => (
          <div
            key={idx}
            style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
          >
            <input
              value={option}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              style={{
                flex: 1,
                border: selected ? "2px solid #0070f3" : "1px solid #ccc",
              }}
            />
            <button
              type="button"
              onClick={() => handleRemoveOption(idx)}
              disabled={options.length <= 1}
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
  );
}
