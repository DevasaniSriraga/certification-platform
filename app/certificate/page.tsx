import Link from "next/link";
import { verifySession, getCurrentUser } from "@/app/lib/dal";
import { getAllModuleProgress } from "@/app/lib/quiz-progress";
import { hasApprovedProject } from "@/app/lib/project-progress";
import { getOrCreateCertificate } from "@/app/lib/certificate-registry";
import { quizModules } from "@/app/lib/quiz-data";

export default async function CertificatePage() {
  const session = await verifySession();
  const [user, progress, projectApproved] = await Promise.all([
    getCurrentUser(),
    getAllModuleProgress(session.userId),
    hasApprovedProject(session.userId),
  ]);

  const passedCount = progress.filter((p) => p.passed).length;
  const quizComplete = passedCount === quizModules.length;
  const earned = quizComplete && projectApproved;

  const certificate = earned ? await getOrCreateCertificate(session.userId) : null;

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col px-6 py-12">
      <Link href="/dashboard" className="text-sm underline">
        &larr; Back to dashboard
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Certificate</h1>

      {earned ? (
        <div className="mt-8 flex flex-col items-center gap-6 rounded border border-gray-300 p-8 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Omni BI Certification Program
          </p>
          <p className="text-lg">This certifies that</p>
          <p className="text-2xl font-semibold">{user?.fullName}</p>
          <p className="text-gray-600">
            has successfully completed all {quizModules.length} modules and
            the practical project of the certification program.
          </p>
          {certificate && (
            <p className="text-xs text-gray-400">
              Certificate ID: {certificate.certificateId} · Issued{" "}
              {certificate.issuedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          <a
            href="/api/certificate"
            className="rounded bg-black px-5 py-2.5 text-white"
          >
            Download certificate (PDF)
          </a>
        </div>
      ) : !quizComplete ? (
        <div className="mt-8 rounded border border-gray-300 p-6">
          <p className="text-gray-700">
            Complete all {quizModules.length} modules with a passing score to
            unlock your certificate.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {passedCount} / {quizModules.length} modules passed.
          </p>
          <Link
            href="/quiz"
            className="mt-4 inline-block rounded border border-gray-400 px-4 py-2 text-sm"
          >
            Go to quiz
          </Link>
        </div>
      ) : (
        <div className="mt-8 rounded border border-gray-300 p-6">
          <p className="text-gray-700">
            Submit and get your practical project approved to unlock your
            certificate.
          </p>
          <Link
            href="/project"
            className="mt-4 inline-block rounded border border-gray-400 px-4 py-2 text-sm"
          >
            Go to project submission
          </Link>
        </div>
      )}
    </main>
  );
}
