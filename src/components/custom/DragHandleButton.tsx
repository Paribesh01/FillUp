// src/components/custom/DragHandleButton.tsx
import React from "react";

export const DragHandleButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
  <button
    type="button"
    className="drag-handle"
    tabIndex={-1}
    ref={ref}
    {...props}
    // style or className for drag icon
  >
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="5" cy="5" r="2" fill="#888" />
      <circle cx="5" cy="15" r="2" fill="#888" />
      <circle cx="15" cy="5" r="2" fill="#888" />
      <circle cx="15" cy="15" r="2" fill="#888" />
    </svg>
  </button>
));
