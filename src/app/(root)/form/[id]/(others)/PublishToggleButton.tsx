"use client";
import { togglePublish } from "@/app/actions/form";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function PublishToggleButton({
  docId,
  published,
}: {
  docId: string;
  published: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isPublished, setIsPublished] = useState(published);

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await togglePublish(docId, !isPublished);
        setIsPublished((prev) => !prev);
        toast.success(!isPublished ? "Form published!" : "Form unpublished!");
      } catch (e) {
        toast.error("Failed to update publish status.");
      }
    });
  };

  return (
    <Button
      variant={isPublished ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}
