import Link from "next/link";
import { verifyAdminSession } from "@/app/lib/dal";
import { prisma } from "@/app/lib/prisma";
import { CreateUserForm } from "./create-user-form";
import { ProjectReviewForm } from "./project-review-form";

export default async function AdminPage() {
  await verifyAdminSession();

  const [users, pendingSubmissions, certificates] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    }),
    prisma.projectSubmission.findMany({
      where: { status: "pending" },
      orderBy: { submittedAt: "asc" },
      include: { user: { select: { fullName: true, email: true } } },
    }),
    prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
      include: { user: { select: { fullName: true, email: true } } },
    }),
  ]);

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-2xl flex-col px-6 py-12">
      <Link href="/dashboard" className="text-sm underline">
        &larr; Back to dashboard
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Admin</h1>
      <p className="mt-2 text-gray-600">
        Create learner accounts and share the email/password with them
        directly.
      </p>

      <div className="mt-8">
        <CreateUserForm />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium">Accounts ({users.length})</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between rounded border border-gray-200 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{u.fullName}</p>
                <p className="text-gray-500">{u.email}</p>
              </div>
              <div className="text-right text-gray-400">
                {u.role === "admin" && (
                  <span className="mr-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    Admin
                  </span>
                )}
                <span>
                  {u.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium">
          Pending project reviews ({pendingSubmissions.length})
        </h2>
        {pendingSubmissions.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">Nothing to review.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {pendingSubmissions.map((s) => (
              <li
                key={s.id}
                className="rounded border border-amber-200 bg-amber-50 p-4 text-sm"
              >
                <p className="font-medium">{s.user.fullName}</p>
                <p className="text-gray-500">{s.user.email}</p>
                <p className="mt-2">
                  Link:{" "}
                  <a href={s.link} className="underline" target="_blank">
                    {s.link}
                  </a>
                </p>
                <p>
                  PDF:{" "}
                  <a href={s.pdfUrl} className="underline" target="_blank">
                    {s.pdfFileName}
                  </a>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Submitted {s.submittedAt.toLocaleDateString()}
                </p>
                <ProjectReviewForm userId={s.userId} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium">
          Certificates issued ({certificates.length})
        </h2>
        {certificates.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">None yet.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {certificates.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded border border-gray-200 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{c.user.fullName}</p>
                  <p className="text-gray-500">{c.user.email}</p>
                </div>
                <div className="text-right text-gray-400">
                  <p>{c.certificateId}</p>
                  <p>{c.issuedAt.toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
