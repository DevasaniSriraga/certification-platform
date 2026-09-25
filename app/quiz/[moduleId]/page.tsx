import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/app/lib/dal";
import {
  getModule,
  quizCategories,
  buildReview,
  MAX_ATTEMPTS,
  QUIZ_TIME_ESTIMATE,
} from "@/app/lib/quiz-data";
import { getModuleProgress, getLatestAttempt } from "@/app/lib/quiz-progress";
import { QuizForm } from "./quiz-form";
import { QuizReviewList } from "./quiz-review";

function formatLockedUntil(date: Date) {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function QuizModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const session = await verifySession();

  const quizModule = getModule(moduleId);
  if (!quizModule) {
    notFound();
  }

  const [progress, latestAttempt] = await Promise.all([
    getModuleProgress(session.userId, moduleId),
    getLatestAttempt(session.userId, moduleId),
  ]);
  const category = quizCategories.find((c) => c.id === quizModule.categoryId);

  const publicQuestions = quizModule.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options,
  }));

  const reveal = progress.passed || progress.locked;
  const review =
    latestAttempt &&
    buildReview(
      quizModule,
      latestAttempt.answers as Record<string, number>,
      reveal
    );

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col px-6 py-12">
      <Link href="/quiz" className="text-sm underline">
        &larr; Back to modules
      </Link>

      <p className="mt-4 text-sm font-medium uppercase tracking-wide text-gray-500">
        {category?.title}
      </p>
      <h1 className="text-2xl font-semibold">
        Module {quizModule.categoryOrder}: {quizModule.title}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {quizModule.difficulty} · {quizModule.questions.length} questions ·{" "}
        {QUIZ_TIME_ESTIMATE}
      </p>

      {progress.passed ? (
        <div className="mt-8 rounded border border-green-300 bg-green-50 p-6">
          <p className="font-medium text-green-800">
            You already passed this module ({progress.bestScore}/
            {progress.bestTotal}).
          </p>
        </div>
      ) : progress.locked ? (
        <div className="mt-8 rounded border border-red-300 bg-red-50 p-6">
          <p className="font-medium text-red-800">
            No attempts remaining. You used all {MAX_ATTEMPTS} attempts
            without reaching 80%.
          </p>
          {progress.lockedUntil && (
            <p className="mt-1 text-sm text-red-700">
              Try again after {formatLockedUntil(progress.lockedUntil)}.
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="mt-2 text-gray-600">
            80% to pass · attempt {progress.attemptsUsed + 1} of{" "}
            {MAX_ATTEMPTS}
          </p>
          <QuizForm
            moduleId={moduleId}
            questions={publicQuestions}
            initialReview={review ?? undefined}
          />
        </>
      )}

      {(progress.passed || progress.locked) && review && (
        <QuizReviewList review={review} />
      )}
    </main>
  );
}
