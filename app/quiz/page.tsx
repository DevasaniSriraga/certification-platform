import Link from "next/link";
import { verifySession } from "@/app/lib/dal";
import {
  quizModules,
  getCategoriesWithModules,
  MAX_ATTEMPTS,
} from "@/app/lib/quiz-data";
import { getAllModuleProgress } from "@/app/lib/quiz-progress";
import { additionalResources } from "@/app/lib/learning-materials";

export default async function QuizIndexPage() {
  const session = await verifySession();
  const progress = await getAllModuleProgress(session.userId);
  const progressByModule = new Map(progress.map((p) => [p.moduleId, p]));

  const passedCount = progress.filter((p) => p.passed).length;
  const allPassed = passedCount === quizModules.length;
  const categories = getCategoriesWithModules();

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col px-6 py-12">
      <Link href="/dashboard" className="text-sm underline">
        &larr; Back to dashboard
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Start here</h1>
      <p className="mt-2 text-gray-600">
        View guided resources and module-wise quizzes here. Pass all{" "}
        {quizModules.length} modules at 80% or higher, then submit a
        practical project for approval to earn your certificate. Each module
        allows up to {MAX_ATTEMPTS} attempts.
      </p>

      <p className="mt-8 text-sm font-medium">
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

      {categories.map((category) => (
        <div key={category.id} className="mt-10">
          <h2 className="text-lg font-medium">{category.title}</h2>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <a
              href={category.recordedWalkthroughUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline"
            >
              Recorded walkthrough
            </a>
            <a
              href={category.trainingSlidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline"
            >
              Training slides
            </a>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {category.modules.map((quizModule) => {
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
                      Module {quizModule.categoryOrder}: {quizModule.title}
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
        </div>
      ))}

      <div className="mt-10">
        <h2 className="text-lg font-medium">Additional resources</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {additionalResources.map((resource) => (
            <li key={resource.id} className="rounded border border-gray-300 p-4">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                {resource.title}
              </a>
              <p className="mt-1 text-sm text-gray-600">
                {resource.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
