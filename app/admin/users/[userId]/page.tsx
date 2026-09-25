import Link from "next/link";
import { notFound } from "next/navigation";
import { verifyAdminSession } from "@/app/lib/dal";
import { prisma } from "@/app/lib/prisma";
import {
  getCategoriesWithModules,
  MAX_ATTEMPTS,
} from "@/app/lib/quiz-data";
import { getAllModuleProgress } from "@/app/lib/quiz-progress";
import { getProjectSubmission } from "@/app/lib/project-progress";
import { getUserProgressSummary } from "@/app/lib/progress";
import { ProgressBar } from "@/app/components/progress-bar";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await verifyAdminSession();
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, email: true, role: true, createdAt: true },
  });
  if (!user) {
    notFound();
  }

  const [moduleProgress, submission, certificate, summary] = await Promise.all([
    getAllModuleProgress(userId),
    getProjectSubmission(userId),
    prisma.certificate.findUnique({ where: { userId } }),
    getUserProgressSummary(userId),
  ]);

  const progressByModule = new Map(moduleProgress.map((p) => [p.moduleId, p]));
  const categories = getCategoriesWithModules();

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-2xl flex-col px-6 py-12">
      <Link href="/admin" className="text-sm underline">
        &larr; Back to admin
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">{user.fullName}</h1>
      <p className="text-gray-600">{user.email}</p>

      <div className="mt-6">
        <ProgressBar percent={summary.percent} label="Course progress" />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium">Quiz attempts & scores</h2>
        {categories.map((category) => (
          <div key={category.id} className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500">
              {category.title}
            </h3>
            <ul className="mt-2 flex flex-col gap-2">
              {category.modules.map((quizModule) => {
                const p = progressByModule.get(quizModule.id);
                const attemptsUsed = p?.attemptsUsed ?? 0;
                const passed = p?.passed ?? false;
                const locked = p?.locked ?? false;

                let statusText: string;
                let statusClass: string;
                if (passed) {
                  statusText = "Passed";
                  statusClass = "text-green-700";
                } else if (locked) {
                  statusText = p?.lockedUntil
                    ? `Locked until ${p.lockedUntil.toLocaleString("en-US", {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}`
                    : "Locked";
                  statusClass = "text-red-700";
                } else if (attemptsUsed > 0) {
                  statusText = "In progress";
                  statusClass = "text-amber-700";
                } else {
                  statusText = "Not started";
                  statusClass = "text-gray-500";
                }

                return (
                  <li
                    key={quizModule.id}
                    className="flex items-center justify-between rounded border border-gray-200 px-4 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        Module {quizModule.categoryOrder}: {quizModule.title}
                      </p>
                      <p className={statusClass}>{statusText}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>
                        {attemptsUsed} / {MAX_ATTEMPTS} attempts
                      </p>
                      <p>
                        Best: {p?.bestScore ?? "–"}/{p?.bestTotal ?? quizModule.questions.length}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium">Practical project</h2>
        {!submission ? (
          <p className="mt-2 text-sm text-gray-500">Not submitted yet.</p>
        ) : (
          <div className="mt-2 rounded border border-gray-200 p-4 text-sm">
            <p className="font-medium capitalize">{submission.status}</p>
            <p className="mt-1">
              Link:{" "}
              <a href={submission.link} target="_blank" className="underline">
                {submission.link}
              </a>
            </p>
            <p>
              PDF:{" "}
              <a href={submission.pdfUrl} target="_blank" className="underline">
                {submission.pdfFileName}
              </a>
            </p>
            {submission.reviewNote && (
              <p className="mt-1 text-gray-600">Note: {submission.reviewNote}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium">Certificate</h2>
        {!certificate ? (
          <p className="mt-2 text-sm text-gray-500">Not earned yet.</p>
        ) : (
          <p className="mt-2 text-sm text-gray-700">
            {certificate.certificateId} · Issued{" "}
            {certificate.issuedAt.toLocaleDateString()}
          </p>
        )}
      </div>
    </main>
  );
}
