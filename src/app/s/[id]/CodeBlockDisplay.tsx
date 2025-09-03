import React from "react";

export default function CodeBlockDisplay({ node }: { node: any }) {
  return (
    <pre
      style={{
        background: "#f5f5f5",
        padding: 8,
        borderRadius: 4,
        marginBottom: 16,
        fontSize: 14,
        overflowX: "auto",
      }}
    >
      {node.content?.map((c: any) => c.text).join("")}
    </pre>
  );
}
