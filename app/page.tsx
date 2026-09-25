import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="flex items-center gap-4 rounded-xl bg-white px-6 py-4 shadow-sm">
        <Image
          src="/logos/copart-logo.png"
          alt="Copart"
          width={90}
          height={34}
          priority
        />
        <span className="text-gray-400">×</span>
        <Image
          src="/logos/omni-logo.png"
          alt="Omni"
          width={70}
          height={28}
          priority
        />
      </div>

      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-gray-500">
        Copart Data Team presents
      </p>
      <h1 className="mt-2 text-3xl font-semibold">
        Omni Analytics Certification Program
      </h1>
      <p className="mt-4 text-gray-600">
        Learn Omni through guided resources, pass the module quizzes, submit
        a practical project, and earn your certification.
      </p>

      <Link
        href="/login"
        className="mt-8 rounded bg-black px-5 py-2.5 text-white"
      >
        Log in
      </Link>
      <p className="mt-4 text-sm text-gray-500">
        Don&apos;t have an account? Contact your administrator.
      </p>
    </main>
  );
}
