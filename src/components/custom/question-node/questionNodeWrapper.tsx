import React, { useRef, useState } from "react";
import { DragHandleButton } from "../DragHandleButton";
import { createPortal } from "react-dom";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

export function QuestionNodeWrapper({
  children,
  onOpenSettings,
  node,
  updateAttributes,
  editor,
  getPos,
}: {
  children: React.ReactNode;
  onOpenSettings: () => void;
  node?: any;
  updateAttributes?: (attrs: any) => void;
  editor: any;
  getPos: () => number | undefined;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Custom drag start: store the node's position
  const handleDragStart = (event: React.DragEvent) => {
    if (nodeRef.current) {
      event.dataTransfer.setDragImage(nodeRef.current, 30, 10);
    }
    if (typeof getPos === "function") {
      const pos = getPos();
      if (typeof pos === "number" && !isNaN(pos)) {
        event.dataTransfer.setData(
          "application/x-question-node-pos",
          pos.toString()
        );
      } else {
        // Prevent drag if pos is invalid
        console.warn(
          "Drag start: getPos() returned invalid value",
          pos,
          node?.attrs?.label,
          node?.attrs?.id
        );
        event.preventDefault();
        return;
      }
    }
    console.log(
      "Drag started",
      getPos?.(),
      node?.attrs?.label,
      node?.attrs?.id
    );
  };

  // Allow drop
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    const pos = getPos?.();
    console.log("Drag over", pos, node?.attrs?.label, node?.attrs?.id);
  };

  // Debug: log when drag enters a node
  const handleDragEnter = (event: React.DragEvent) => {
    const pos = getPos?.();
    console.log("Drag enter", pos, node?.attrs?.label, node?.attrs?.id);
  };

  // On drop, move the node in the Tiptap doc
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const fromPos = parseInt(
      event.dataTransfer.getData("application/x-question-node-pos"),
      10
    );
    let toPos = getPos?.();
    console.log("Drop event", {
      fromPos,
      toPos,
      node,
      editor,
      label: node?.attrs?.label,
      id: node?.attrs?.id,
    });
    if (
      typeof fromPos === "number" &&
      typeof toPos === "number" &&
      fromPos !== toPos &&
      editor
    ) {
      // If moving down, adjust toPos because the document shrinks after deletion
      if (fromPos < toPos) {
        toPos = toPos - node.nodeSize;
      }
      console.log(
        "Moving node",
        node,
        "from",
        fromPos,
        "to",
        toPos,
        "nodeSize",
        node.nodeSize
      );
      console.log("Before move", JSON.stringify(editor.getJSON()));
      // Try just deleting
      editor
        .chain()
        .focus()
        .deleteRange({ from: fromPos, to: fromPos + node.nodeSize })
        .run();
      console.log("After delete", JSON.stringify(editor.getJSON()));
      // Try just inserting
      editor.chain().focus().insertContentAt(toPos, node.toJSON()).run();
      console.log("After insert", JSON.stringify(editor.getJSON()));
      // Now try the full move (delete + insert in one chain)
      // editor
      //   .chain()
      //   .focus()
      //   .deleteRange({ from: fromPos, to: fromPos + node.nodeSize })
      //   .insertContentAt(toPos, node.toJSON())
      //   .run();
      // console.log("After move", JSON.stringify(editor.getJSON()));
    }
  };

  // Debug: global drop event
  React.useEffect(() => {
    const globalDrop = (e: DragEvent) => {
      console.log("GLOBAL DROP", e);
    };
    window.addEventListener("drop", globalDrop);
    return () => window.removeEventListener("drop", globalDrop);
  }, []);

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
    <NodeViewWrapper
      className="question-node flex items-start group relative"
      ref={nodeRef}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDropCapture={handleDrop}
    >
      {/* Drag handle on the left, only visible on hover */}
      <span
        className="tiptap-drag-handle mr-2"
        contentEditable={false}
        style={{ display: "flex", alignItems: "center", height: "100%" }}
      >
        <span className="drag-handle-visibility">
          <button
            ref={buttonRef}
            draggable
            onDragStart={handleDragStart}
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
    </NodeViewWrapper>
  );
}
