"use client";

import { useState, useTransition } from "react";
import { reviewProject } from "@/app/actions/project";

export function ProjectReviewForm({ userId }: { userId: string }) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const handleReview = (approve: boolean) => {
    startTransition(async () => {
      await reviewProject(userId, approve, note);
    });
  };

  return (
    <div className="mt-3 flex flex-col gap-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Review note (required for reject)"
        className="rounded border border-gray-300 px-3 py-1.5 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => handleReview(true)}
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={pending || note.trim() === ""}
          onClick={() => handleReview(false)}
          className="rounded border border-red-400 px-3 py-1.5 text-sm text-red-700 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
