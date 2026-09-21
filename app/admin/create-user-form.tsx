"use client";

import { useActionState, useRef, useEffect } from "react";
import { createUserAccount } from "@/app/actions/admin";

export function CreateUserForm() {
  const [state, action, pending] = useActionState(
    createUserAccount,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded border border-gray-300 p-6"
    >
      <h2 className="text-lg font-medium">Create account</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="fullName" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          placeholder="Jane Doe"
          className="rounded border border-gray-300 px-3 py-2"
        />
        {state?.errors?.fullName && (
          <p className="text-sm text-red-600">{state.errors.fullName[0]}</p>
        )}
        <p className="text-xs text-gray-500">
          Used exactly as entered on the learner's certificate.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="learner@example.com"
          className="rounded border border-gray-300 px-3 py-2"
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="text"
          placeholder="Set a password to share with the learner"
          className="rounded border border-gray-300 px-3 py-2 font-mono"
        />
        {state?.errors?.password && (
          <div className="text-sm text-red-600">
            <p>Password must:</p>
            <ul className="list-inside list-disc">
              {state.errors.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {state?.message && (
        <p
          className={`text-sm ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        disabled={pending}
        type="submit"
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
