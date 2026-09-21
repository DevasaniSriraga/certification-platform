import Link from "next/link";
import { verifySession, getCurrentUser } from "@/app/lib/dal";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
  await verifySession();
  const user = await getCurrentUser();

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

      <div className="mt-10 flex flex-col gap-4">
        <Link
          href="/learning"
          className="rounded border border-gray-300 p-4 font-medium hover:bg-gray-50"
        >
          Learning material &rarr;
        </Link>
        <Link
          href="/quiz"
          className="rounded border border-gray-300 p-4 font-medium hover:bg-gray-50"
        >
          Certification quiz &rarr;
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
