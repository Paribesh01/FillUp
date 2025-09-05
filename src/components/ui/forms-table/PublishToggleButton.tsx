"use client";
import { useState } from "react";
import { togglePublish } from "@/app/actions/form";

export default function PublishToggleButton({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(published);

  const handleToggle = async () => {
    setLoading(true);
    await togglePublish(id, !isPublished);
    setIsPublished(!isPublished);
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        background: isPublished ? "#22c55e" : "#f87171",
        color: "white",
        border: "none",
        borderRadius: 4,
        padding: "4px 12px",
        cursor: "pointer",
      }}
    >
      {loading ? "Updating..." : isPublished ? "Unpublish" : "Publish"}
    </button>
  );
}
