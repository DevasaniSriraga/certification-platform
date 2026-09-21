"use client";

import { useActionState } from "react";
import { submitProject } from "@/app/actions/project";

export function ProjectForm() {
  const [state, action, pending] = useActionState(submitProject, undefined);

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="link" className="text-sm font-medium">
          Link to your dashboard/app
        </label>
        <input
          id="link"
          name="link"
          type="url"
          placeholder="https://..."
          className="rounded border border-gray-300 px-3 py-2"
        />
        {state?.errors?.link && (
          <p className="text-sm text-red-600">{state.errors.link[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="pdf" className="text-sm font-medium">
          Project PDF
        </label>
        <input
          id="pdf"
          name="pdf"
          type="file"
          accept="application/pdf"
          className="rounded border border-gray-300 px-3 py-2"
        />
        {state?.errors?.pdf && (
          <p className="text-sm text-red-600">{state.errors.pdf[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="text-sm text-gray-700">{state.message}</p>
      )}

      <button
        disabled={pending}
        type="submit"
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}
