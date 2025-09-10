"use client";
import { Button } from "@/components/ui/button";
import { deleteForm } from "@/app/actions/form";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const formData = {
  title: "Customer Feedback Survey",
  description: "Collect valuable feedback from our customers",
};

export default function FormSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteForm(params.id);
        setOpen(false);
        toast.success("Form deleted.");
        router.push("/dashboard");
      } catch (e) {
        toast.error("Failed to delete form.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Form Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Form Title
            </label>
            <input
              type="text"
              defaultValue={formData.title}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Description
            </label>
            <textarea
              defaultValue={formData.description}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground"
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-card-foreground">
                Accept Responses
              </p>
              <p className="text-sm text-muted-foreground">
                Allow new form submissions
              </p>
            </div>
            <Button variant="outline" size="sm">
              Toggle
            </Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-card-foreground">Require Login</p>
              <p className="text-sm text-muted-foreground">
                Users must sign in to submit
              </p>
            </div>
            <Button variant="outline" size="sm">
              Toggle
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Danger Zone
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-red-600">Archive Form</p>
              <p className="text-sm text-muted-foreground">
                Hide form from active list
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              Archive
            </Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-red-600">Delete Form</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this form and all responses
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the form and all its responses.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
