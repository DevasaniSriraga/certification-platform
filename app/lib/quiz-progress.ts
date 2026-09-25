import "server-only";
import { prisma } from "@/app/lib/prisma";
import { quizModules, MAX_ATTEMPTS } from "@/app/lib/quiz-data";

export const LOCKOUT_HOURS = 24;

export type ModuleProgress = {
  moduleId: string;
  attemptsUsed: number;
  attemptsRemaining: number;
  passed: boolean;
  bestScore: number | null;
  bestTotal: number | null;
  locked: boolean;
  lockedUntil: Date | null;
};

type AttemptLike = { createdAt: Date; passed: boolean; score: number; total: number };

/**
 * Attempts are grouped into cycles of up to MAX_ATTEMPTS. Once a cycle is
 * exhausted without a pass, it stays locked until LOCKOUT_HOURS after the
 * last attempt in that cycle, at which point a fresh cycle begins
 * automatically — computed purely from attempt history, no extra state.
 */
function currentCycleAttempts(attemptsAsc: AttemptLike[]): AttemptLike[] {
  let cycleStart = 0;
  for (let i = 0; i < attemptsAsc.length; i++) {
    const windowLen = i - cycleStart + 1;
    if (windowLen === MAX_ATTEMPTS) {
      const window = attemptsAsc.slice(cycleStart, i + 1);
      const anyPassed = window.some((a) => a.passed);
      if (!anyPassed) {
        const lockedUntil = new Date(
          attemptsAsc[i].createdAt.getTime() + LOCKOUT_HOURS * 60 * 60 * 1000
        );
        if (Date.now() >= lockedUntil.getTime()) {
          cycleStart = i + 1;
        }
      }
    }
  }
  return attemptsAsc.slice(cycleStart);
}

function summarize(moduleId: string, attempts: AttemptLike[]): ModuleProgress {
  const attemptsAsc = [...attempts].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
  const passed = attemptsAsc.some((a) => a.passed);
  const cycle = currentCycleAttempts(attemptsAsc);
  const attemptsUsed = cycle.length;
  const locked = !passed && attemptsUsed >= MAX_ATTEMPTS;
  const lockedUntil = locked
    ? new Date(
        cycle[cycle.length - 1].createdAt.getTime() +
          LOCKOUT_HOURS * 60 * 60 * 1000
      )
    : null;

  const best = attemptsAsc.reduce<{ score: number; total: number } | null>(
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
    locked,
    lockedUntil,
  };
}

export async function getModuleProgress(
  userId: string,
  moduleId: string
): Promise<ModuleProgress> {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId, moduleId },
  });
  return summarize(moduleId, attempts);
}

export async function getAllModuleProgress(
  userId: string
): Promise<ModuleProgress[]> {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
  });

  return quizModules.map((quizModule) => {
    const moduleAttempts = attempts.filter((a) => a.moduleId === quizModule.id);
    return summarize(quizModule.id, moduleAttempts);
  });
}

export async function hasPassedAllModules(userId: string): Promise<boolean> {
  const progress = await getAllModuleProgress(userId);
  return progress.every((p) => p.passed);
}

export async function getLatestAttempt(userId: string, moduleId: string) {
  return prisma.quizAttempt.findFirst({
    where: { userId, moduleId },
    orderBy: { createdAt: "desc" },
  });
}
