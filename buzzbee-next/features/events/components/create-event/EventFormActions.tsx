import React from "react";
import { Button } from "@/components/ui/Button";

interface EventFormActionsProps {
  isPending: boolean;
  isEditing: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function EventFormActions({
  isPending,
  isEditing,
  onSaveDraft,
  onPublish,
}: EventFormActionsProps) {
  return (
    <div className="flex gap-4 pt-6 border-t border-gray-200">
      <Button
        variant="ghost"
        className="flex-1"
        onClick={onSaveDraft}
        icon={null}
        type="button"
        disabled={isPending}
      >
        Save as Draft
      </Button>
      <Button
        variant="primary"
        size="lg"
        className="flex-1"
        icon={null}
        type="button"
        onClick={onPublish}
        disabled={isPending}
      >
        {isPending
          ? isEditing
            ? "Updating..."
            : "Publishing..."
          : isEditing
            ? "Update Event"
            : "Publish Event"}
      </Button>
    </div>
  );
}
