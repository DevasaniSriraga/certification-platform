import "server-only";
import { prisma } from "@/app/lib/prisma";
import { quizModules, MAX_ATTEMPTS } from "@/app/lib/quiz-data";

export type ModuleProgress = {
  moduleId: string;
  attemptsUsed: number;
  attemptsRemaining: number;
  passed: boolean;
  bestScore: number | null;
  bestTotal: number | null;
  locked: boolean;
};

export async function getModuleProgress(
  userId: string,
  moduleId: string
): Promise<ModuleProgress> {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId, moduleId },
    orderBy: { createdAt: "desc" },
  });

  const attemptsUsed = attempts.length;
  const passed = attempts.some((a) => a.passed);
  const best = attempts.reduce<{ score: number; total: number } | null>(
    (acc, a) => (!acc || a.score > acc.score ? { score: a.score, total: a.total } : acc),
    null
  );

  return {
    moduleId,
    attemptsUsed,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - attemptsUsed),
    passed,
    bestScore: best?.score ?? null,
    bestTotal: best?.total ?? null,
    locked: !passed && attemptsUsed >= MAX_ATTEMPTS,
  };
}

export async function getAllModuleProgress(
  userId: string
): Promise<ModuleProgress[]> {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
  });

  return quizModules.map((quizModule) => {
    const moduleAttempts = attempts.filter(
      (a) => a.moduleId === quizModule.id
    );
    const attemptsUsed = moduleAttempts.length;
    const passed = moduleAttempts.some((a) => a.passed);
    const best = moduleAttempts.reduce<{ score: number; total: number } | null>(
      (acc, a) =>
        !acc || a.score > acc.score ? { score: a.score, total: a.total } : acc,
      null
    );

    return {
      moduleId: quizModule.id,
      attemptsUsed,
      attemptsRemaining: Math.max(0, MAX_ATTEMPTS - attemptsUsed),
      passed,
      bestScore: best?.score ?? null,
      bestTotal: best?.total ?? null,
      locked: !passed && attemptsUsed >= MAX_ATTEMPTS,
    };
  });
}

export async function hasPassedAllModules(userId: string): Promise<boolean> {
  const progress = await getAllModuleProgress(userId);
  return progress.every((p) => p.passed);
}
