import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/app/lib/dal";
import { getModule, MAX_ATTEMPTS } from "@/app/lib/quiz-data";
import { getModuleProgress } from "@/app/lib/quiz-progress";
import { QuizForm } from "./quiz-form";

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

  const progress = await getModuleProgress(session.userId, moduleId);

  const publicQuestions = quizModule.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options,
  }));

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col px-6 py-12">
      <Link href="/quiz" className="text-sm underline">
        &larr; Back to modules
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">
        Module {quizModule.order}: {quizModule.title}
      </h1>

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
        </div>
      ) : (
        <>
          <p className="mt-2 text-gray-600">
            {quizModule.questions.length} questions · 80% to pass · attempt{" "}
            {progress.attemptsUsed + 1} of {MAX_ATTEMPTS}
          </p>
          <QuizForm moduleId={moduleId} questions={publicQuestions} />
        </>
      )}
    </main>
  );
}
