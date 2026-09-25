"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitQuizAttempt, type QuizResultState } from "@/app/actions/quiz";
import { QuizReviewList } from "./quiz-review";
import type { ReviewItem } from "@/app/lib/quiz-data";

type PublicQuestion = {
  id: string;
  text: string;
  options: string[];
};

function formatLockedUntil(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function QuizForm({
  moduleId,
  questions,
  initialReview,
}: {
  moduleId: string;
  questions: PublicQuestion[];
  initialReview?: ReviewItem[];
}) {
  const boundAction = submitQuizAttempt.bind(null, moduleId);
  const [state, action, pending] = useActionState<QuizResultState, FormData>(
    boundAction,
    undefined
  );

  if (state && "score" in state) {
    return (
      <div className="mt-8 flex flex-col gap-6">
        <div className="rounded border border-gray-300 p-6">
          <h2 className="text-xl font-semibold">
            {state.passed ? "You passed!" : "Not quite there"}
          </h2>
          <p className="mt-2 text-gray-600">
            Score: {state.score} / {state.total} (
            {Math.round((state.score / state.total) * 100)}%)
          </p>

          {state.passed ? (
            <Link
              href="/quiz"
              className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
            >
              Back to modules
            </Link>
          ) : state.attemptsRemaining > 0 ? (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm text-gray-600">
                {state.attemptsRemaining} attempt(s) remaining.
              </p>
              <a
                href={`/quiz/${moduleId}`}
                className="inline-block rounded border border-gray-400 px-4 py-2 text-center"
              >
                Try again
              </a>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm text-red-700">
                No attempts remaining for this module.
                {state.lockedUntil &&
                  ` Try again after ${formatLockedUntil(state.lockedUntil)}.`}
              </p>
              <Link href="/quiz" className="underline">
                Back to modules
              </Link>
            </div>
          )}
        </div>

        <QuizReviewList review={state.review} />
      </div>
    );
  }

  return (
    <>
      <form action={action} className="mt-8 flex flex-col gap-8">
        {state && "error" in state && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}

        {questions.map((question, index) => (
          <fieldset key={question.id} className="flex flex-col gap-2">
            <legend className="font-medium">
              {index + 1}. {question.text}
            </legend>
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={optionIndex}
                  required
                  className="h-4 w-4"
                />
                {option}
              </label>
            ))}
          </fieldset>
        ))}

        <button
          disabled={pending}
          type="submit"
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Submitting…" : "Submit answers"}
        </button>
      </form>

      {initialReview && (
        <>
          <p className="mt-8 text-sm text-gray-500">
            From your last attempt:
          </p>
          <QuizReviewList review={initialReview} />
        </>
      )}
    </>
  );
}
