import React, { useRef, useState } from "react";
import { DragHandleButton } from "../DragHandleButton";
import { createPortal } from "react-dom";

export function QuestionNodeWrapper({
  children,
  onOpenSettings,
  node,
  updateAttributes,
}: // Removed onDragOver, onDrop from props
{
  children: React.ReactNode;
  onOpenSettings: () => void;
  node?: any;
  updateAttributes?: (attrs: any) => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Optional: Only for custom drag image
  const handleDragStart = (event: React.DragEvent) => {
    if (nodeRef.current) {
      event.dataTransfer.setDragImage(nodeRef.current, 30, 10);
    }
    // Do NOT set custom data unless you handle drop yourself
  };

  // Toggle menu and set position next to drag handle
  const handleButtonClick = () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (buttonRef.current && nodeRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const parentRect = nodeRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.top - parentRect.top,
        left: buttonRect.right - parentRect.left + 8, // 8px gap to the right
      });
    }
    setOpen(true);
  };

  // Close menu on click outside
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        settingsRef.current &&
        !settingsRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      className="question-node flex items-start group relative"
      ref={nodeRef}
      // Removed onDragOver and onDrop
    >
      {/* Drag handle on the left, only visible on hover */}
      <span
        className="tiptap-drag-handle mr-2"
        contentEditable={false}
        draggable={true}
        data-drag-handle
        style={{ display: "flex", alignItems: "center", height: "100%" }}
        onDragStart={handleDragStart} // Only if you want a custom drag image
      >
        <span className="drag-handle-visibility">
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            type="button"
          >
            <DragHandleButton />
          </button>
        </span>
      </span>
      <div className="flex-1">{children}</div>
      {open && position && (
        <div
          ref={settingsRef}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: 12,
            zIndex: 1000,
            minWidth: 220,
          }}
        >
          <h4 style={{ margin: "0 0 12px 0", fontWeight: 600, fontSize: 16 }}>
            Question Settings
          </h4>
          <label style={{ display: "block", marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={!!node?.attrs.required}
              onChange={(e) => {
                console.log("Checkbox changed", e.target.checked);
                updateAttributes?.({ required: e.target.checked });
              }}
              style={{ marginRight: 6 }}
            />
            Required
          </label>
          <label style={{ display: "block" }}>
            Default Answer:
            <input
              type="text"
              value={node?.attrs.defaultAnswer || ""}
              onChange={(e) => {
                console.log("Default answer changed", e.target.value);
                updateAttributes?.({ defaultAnswer: e.target.value });
              }}
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
        </div>
      )}
    </div>
  );
}
