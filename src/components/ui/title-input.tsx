import * as React from "react";
import { cn } from "@/lib/utils";

export interface TitleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const TitleInput = React.forwardRef<HTMLInputElement, TitleInputProps>(
  (
    { className, label = "Title", placeholder = "Title of the form", ...props },
    ref
  ) => {
    return (
      <div className={cn("w-full", className)}>
        <label className="sr-only" htmlFor={props.id || "title-input"}>
          {label}
        </label>
        <input
          id={props.id || "title-input"}
          ref={ref}
          type="text"
          placeholder={placeholder}
          // No border, no ring, clear focus styles; set caret color for visibility
          className={cn(
            "w-full bg-transparent border-none outline-none ring-0",
            "focus:outline-none focus-visible:outline-none focus:ring-0",
            "text-2xl md:text-3xl font-semibold font-sans",
            "placeholder:text-muted-foreground caret-blue-600",
            "px-0 py-2"
          )}
          {...props}
        />
      </div>
    );
  }
);

TitleInput.displayName = "TitleInput";
