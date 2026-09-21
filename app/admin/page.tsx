import Link from "next/link";
import { verifyAdminSession } from "@/app/lib/dal";
import { prisma } from "@/app/lib/prisma";
import { CreateUserForm } from "./create-user-form";

export default async function AdminPage() {
  await verifyAdminSession();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, fullName: true, email: true, role: true, createdAt: true },
  });

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
    </main>
  );
}
