import Link from "next/link";
import { verifySession } from "@/app/lib/dal";
import { quizModules, MAX_ATTEMPTS } from "@/app/lib/quiz-data";
import { getAllModuleProgress } from "@/app/lib/quiz-progress";

export default async function QuizIndexPage() {
  const session = await verifySession();
  const progress = await getAllModuleProgress(session.userId);
  const progressByModule = new Map(progress.map((p) => [p.moduleId, p]));

  const passedCount = progress.filter((p) => p.passed).length;
  const allPassed = passedCount === quizModules.length;

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col px-6 py-12">
      <Link href="/dashboard" className="text-sm underline">
        &larr; Back to dashboard
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Certification quiz</h1>
      <p className="mt-2 text-gray-600">
        Pass all {quizModules.length} modules at 80% or higher, then submit a
        practical project for approval to earn your certificate. Each module
        allows up to {MAX_ATTEMPTS} attempts.
      </p>

      <p className="mt-4 text-sm font-medium">
        {passedCount} / {quizModules.length} modules passed
      </p>

      {allPassed && (
        <Link
          href="/project"
          className="mt-4 rounded bg-black px-4 py-2 text-center text-white"
        >
          Submit your practical project &rarr;
        </Link>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {quizModules.map((quizModule) => {
          const p = progressByModule.get(quizModule.id);
          const passed = p?.passed ?? false;
          const attemptsUsed = p?.attemptsUsed ?? 0;
          const locked = p?.locked ?? false;

          let status: string;
          let statusClass: string;
          if (passed) {
            status = `Passed (${p?.bestScore}/${p?.bestTotal})`;
            statusClass = "text-green-700";
          } else if (locked) {
            status = "No attempts remaining";
            statusClass = "text-red-700";
          } else if (attemptsUsed > 0) {
            status = `${MAX_ATTEMPTS - attemptsUsed} attempt(s) left`;
            statusClass = "text-amber-700";
          } else {
            status = "Not started";
            statusClass = "text-gray-500";
          }

          return (
            <li
              key={quizModule.id}
              className="flex items-center justify-between rounded border border-gray-300 p-4"
            >
              <div>
                <p className="font-medium">
                  Module {quizModule.order}: {quizModule.title}
                </p>
                <p className={`text-sm ${statusClass}`}>{status}</p>
              </div>
              {passed ? (
                <span className="text-sm text-gray-400">Complete</span>
              ) : locked ? (
                <span className="text-sm text-gray-400">Locked</span>
              ) : (
                <Link
                  href={`/quiz/${quizModule.id}`}
                  className="rounded border border-gray-400 px-3 py-1.5 text-sm"
                >
                  {attemptsUsed > 0 ? "Retry" : "Start"}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
