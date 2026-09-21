import "server-only";
import { prisma } from "@/app/lib/prisma";

export async function getProjectSubmission(userId: string) {
  return prisma.projectSubmission.findUnique({ where: { userId } });
}

export async function hasApprovedProject(userId: string): Promise<boolean> {
  const submission = await getProjectSubmission(userId);
  return submission?.status === "approved";
}
