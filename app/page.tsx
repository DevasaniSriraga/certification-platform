import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold">Certification Program</h1>
      <p className="mt-4 text-gray-600">
        Learn the material, pass the quiz, and download your certificate.
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
