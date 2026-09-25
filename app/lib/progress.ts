import "server-only";
import { quizModules } from "@/app/lib/quiz-data";
import { getAllModuleProgress } from "@/app/lib/quiz-progress";
import { getProjectSubmission } from "@/app/lib/project-progress";

export type UserProgressSummary = {
  modulesPassed: number;
  totalModules: number;
  projectStatus: "not_submitted" | "pending" | "rejected" | "approved";
  percent: number;
};

export async function getUserProgressSummary(
  userId: string
): Promise<UserProgressSummary> {
  const [moduleProgress, submission] = await Promise.all([
    getAllModuleProgress(userId),
    getProjectSubmission(userId),
  ]);

  const modulesPassed = moduleProgress.filter((p) => p.passed).length;
  const totalModules = quizModules.length;
  const projectStatus = submission
    ? (submission.status as "pending" | "rejected" | "approved")
    : "not_submitted";
  const projectDone = projectStatus === "approved" ? 1 : 0;
  const percent = Math.round(
    ((modulesPassed + projectDone) / (totalModules + 1)) * 100
  );

  return { modulesPassed, totalModules, projectStatus, percent };
}
