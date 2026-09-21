"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
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
            type="password"
            className="rounded border border-gray-300 px-3 py-2"
          />
          {state?.errors?.password && (
            <p className="text-sm text-red-600">{state.errors.password[0]}</p>
          )}
        </div>

        {state?.message && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}

        <button
          disabled={pending}
          type="submit"
          className="mt-2 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Don&apos;t have an account? Contact your administrator.
      </p>
    </main>
  );
}
