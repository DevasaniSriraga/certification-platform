import Link from "next/link";
import { verifySession } from "@/app/lib/dal";
import { learningMaterials } from "@/app/lib/learning-materials";

export default async function LearningPage() {
  await verifySession();

  return (
    <main className="mx-auto flex w-full min-h-screen max-w-lg flex-col px-6 py-12">
      <Link href="/dashboard" className="text-sm underline">
        &larr; Back to dashboard
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Learning material</h1>
      <p className="mt-2 text-gray-600">
        Review these resources before taking the quiz.
      </p>

      <ul className="mt-8 flex flex-col gap-4">
        {learningMaterials.map((material) => (
          <li
            key={material.id}
            className="rounded border border-gray-300 p-4"
          >
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {material.title}
            </a>
            <p className="mt-1 text-sm text-gray-600">
              {material.description}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
