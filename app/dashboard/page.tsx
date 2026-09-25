import Link from "next/link";
import { verifySession, getCurrentUser } from "@/app/lib/dal";
import { logout } from "@/app/actions/auth";
import { getUserProgressSummary } from "@/app/lib/progress";
import { ProgressBar } from "@/app/components/progress-bar";

export default async function DashboardPage() {
  const session = await verifySession();
  const [user, progress] = await Promise.all([
    getCurrentUser(),
    getUserProgressSummary(session.userId),
  ]);

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {user?.fullName}</h1>
        <form action={logout}>
          <button type="submit" className="text-sm underline">
            Log out
          </button>
        </form>
      </div>

      <p className="mt-4 text-gray-600">{user?.email}</p>

      <div className="mt-6">
        <ProgressBar percent={progress.percent} label="Course progress" />
        <p className="mt-2 text-sm text-gray-500">
          {progress.modulesPassed} / {progress.totalModules} modules passed ·
          Project:{" "}
          {progress.projectStatus === "not_submitted"
            ? "Not submitted"
            : progress.projectStatus === "pending"
              ? "Under review"
              : progress.projectStatus === "rejected"
                ? "Needs changes"
                : "Approved"}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <Link
          href="/quiz"
          className="rounded border border-black bg-black p-4 font-medium text-white hover:bg-gray-800"
        >
          Start here! &rarr;
          <span className="mt-1 block text-sm font-normal text-gray-300">
            View guided resources and module-wise quizzes here.
          </span>
        </Link>
        <Link
          href="/project"
          className="rounded border border-gray-300 p-4 font-medium hover:bg-gray-50"
        >
          Practical project &rarr;
        </Link>
        <Link
          href="/certificate"
          className="rounded border border-gray-300 p-4 font-medium hover:bg-gray-50"
        >
          Certificate &rarr;
        </Link>
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className="rounded border border-gray-300 p-4 font-medium hover:bg-gray-50"
          >
            Admin portal &rarr;
          </Link>
        )}
      </div>
    </main>
  );
}
