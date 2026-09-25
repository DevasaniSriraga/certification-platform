import Link from "next/link";
import { verifySession } from "@/app/lib/dal";
import { hasPassedAllModules } from "@/app/lib/quiz-progress";
import { PROJECT_TIME_ESTIMATE } from "@/app/lib/quiz-data";
import { getProjectSubmission } from "@/app/lib/project-progress";
import { ProjectForm } from "./project-form";

export default async function ProjectPage() {
  const session = await verifySession();
  const allPassed = await hasPassedAllModules(session.userId);

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col px-6 py-12">
      <Link href="/dashboard" className="text-sm underline">
        &larr; Back to dashboard
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Practical project</h1>
      <p className="mt-2 text-gray-600">
        Create a model/topic and build a dashboard/app in Omni for your own
        use case. Share the link, and upload a PDF write-up of what you
        built.
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Estimated time: {PROJECT_TIME_ESTIMATE}
      </p>

      {!allPassed ? (
        <div className="mt-8 rounded border border-gray-300 p-6">
          <p className="text-gray-700">
            Complete all quiz modules before submitting your project.
          </p>
          <Link
            href="/quiz"
            className="mt-4 inline-block rounded border border-gray-400 px-4 py-2 text-sm"
          >
            Go to quiz
          </Link>
        </div>
      ) : (
        <ProjectStatus userId={session.userId} />
      )}
    </main>
  );
}

async function ProjectStatus({ userId }: { userId: string }) {
  const submission = await getProjectSubmission(userId);

  if (!submission || submission.status === "rejected") {
    return (
      <>
        {submission?.status === "rejected" && (
          <div className="mt-8 rounded border border-red-300 bg-red-50 p-4">
            <p className="font-medium text-red-800">
              Your last submission needs changes.
            </p>
            {submission.reviewNote && (
              <p className="mt-1 text-sm text-red-700">
                {submission.reviewNote}
              </p>
            )}
          </div>
        )}
        <ProjectForm />
      </>
    );
  }

  if (submission.status === "pending") {
    return (
      <div className="mt-8 rounded border border-amber-300 bg-amber-50 p-6">
        <p className="font-medium text-amber-800">Under review</p>
        <p className="mt-1 text-sm text-amber-700">
          Submitted {submission.submittedAt.toLocaleDateString()}. An admin
          will review your project soon.
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Link: <a href={submission.link} className="underline">{submission.link}</a>
        </p>
        <p className="text-sm text-gray-600">File: {submission.pdfFileName}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded border border-green-300 bg-green-50 p-6">
      <p className="font-medium text-green-800">Approved!</p>
      <p className="mt-1 text-sm text-green-700">
        Your project has been approved. Your certificate is ready.
      </p>
      <Link
        href="/certificate"
        className="mt-4 inline-block rounded bg-black px-4 py-2 text-sm text-white"
      >
        Go to certificate
      </Link>
    </div>
  );
}
