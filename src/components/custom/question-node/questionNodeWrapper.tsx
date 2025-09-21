import React, { useRef, useState } from "react";
import { DragHandleButton } from "../DragHandleButton";
import { createPortal } from "react-dom";

export function QuestionNodeWrapper({
  children,
  onOpenSettings,
}: {
  children: React.ReactNode;
  onOpenSettings: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handler to set the drag image to the whole node
  const handleDragStart = (event: React.DragEvent) => {
    if (nodeRef.current) {
      event.dataTransfer.setDragImage(nodeRef.current, 30, 10);
    }
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
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
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
    >
      {/* Drag handle on the left, only visible on hover */}
      <span
        className="tiptap-drag-handle mr-2"
        contentEditable={false}
        draggable="true"
        data-drag-handle
        style={{ display: "flex", alignItems: "center", height: "100%" }}
        onDragStart={handleDragStart}
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
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: 8,
            zIndex: 1000,
            minWidth: 180,
          }}
        >
          <div>Random Data 1</div>
          <div>Random Data 2</div>
          <div>Random Data 3</div>
        </div>
      )}
    </div>
  );
}
