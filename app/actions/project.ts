"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { verifySession, verifyAdminSession } from "@/app/lib/dal";
import { prisma } from "@/app/lib/prisma";
import { hasPassedAllModules } from "@/app/lib/quiz-progress";
import { getProjectSubmission } from "@/app/lib/project-progress";
import { ProjectLinkSchema } from "@/app/lib/definitions";

const MAX_PDF_BYTES = 8 * 1024 * 1024; // 8MB

export type SubmitProjectState =
  | {
      errors?: { link?: string[]; pdf?: string[] };
      message?: string;
    }
  | undefined;

export async function submitProject(
  state: SubmitProjectState,
  formData: FormData
): Promise<SubmitProjectState> {
  const session = await verifySession();

  const allPassed = await hasPassedAllModules(session.userId);
  if (!allPassed) {
    return { message: "Complete all quiz modules before submitting a project." };
  }

  const existing = await getProjectSubmission(session.userId);
  if (existing && existing.status !== "rejected") {
    return {
      message:
        existing.status === "approved"
          ? "Your project has already been approved."
          : "Your project is already under review.",
    };
  }

  const validatedFields = ProjectLinkSchema.safeParse({
    link: formData.get("link"),
  });
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const pdf = formData.get("pdf");
  if (!(pdf instanceof File) || pdf.size === 0) {
    return { errors: { pdf: ["Attach a PDF file."] } };
  }
  if (pdf.type !== "application/pdf") {
    return { errors: { pdf: ["File must be a PDF."] } };
  }
  if (pdf.size > MAX_PDF_BYTES) {
    return { errors: { pdf: ["PDF must be under 8MB."] } };
  }

  const blob = await put(`projects/${session.userId}-${pdf.name}`, pdf, {
    access: "public",
    addRandomSuffix: true,
  });

  await prisma.projectSubmission.upsert({
    where: { userId: session.userId },
    create: {
      userId: session.userId,
      link: validatedFields.data.link,
      pdfUrl: blob.url,
      pdfFileName: pdf.name,
    },
    update: {
      link: validatedFields.data.link,
      pdfUrl: blob.url,
      pdfFileName: pdf.name,
      status: "pending",
      reviewNote: null,
      reviewedAt: null,
      submittedAt: new Date(),
    },
  });

  revalidatePath("/project");
  return { message: "Project submitted for review." };
}

export async function reviewProject(
  submissionUserId: string,
  approve: boolean,
  note: string
) {
  await verifyAdminSession();

  await prisma.projectSubmission.update({
    where: { userId: submissionUserId },
    data: {
      status: approve ? "approved" : "rejected",
      reviewNote: note.trim() || null,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/project");
  revalidatePath("/certificate");
}
