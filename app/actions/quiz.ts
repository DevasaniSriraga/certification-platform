"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/app/lib/dal";
import { prisma } from "@/app/lib/prisma";
import { getModule, scoreQuiz, MAX_ATTEMPTS } from "@/app/lib/quiz-data";
import { getModuleProgress } from "@/app/lib/quiz-progress";

export type QuizResultState =
  | {
      error: string;
    }
  | {
      score: number;
      total: number;
      passed: boolean;
      attemptsRemaining: number;
    }
  | undefined;

export async function submitQuizAttempt(
  moduleId: string,
  state: QuizResultState,
  formData: FormData
): Promise<QuizResultState> {
  const session = await verifySession();
  const quizModule = getModule(moduleId);

  if (!quizModule) {
    return { error: "This module does not exist." };
  }

  const progress = await getModuleProgress(session.userId, moduleId);
  if (progress.passed) {
    return { error: "You've already passed this module." };
  }
  if (progress.attemptsUsed >= MAX_ATTEMPTS) {
    return { error: "No attempts remaining for this module." };
  }

  const answers: Record<string, number> = {};
  for (const question of quizModule.questions) {
    const raw = formData.get(question.id);
    if (typeof raw === "string" && raw !== "") {
      answers[question.id] = Number(raw);
    }
  }

  const { score, total, passed } = scoreQuiz(quizModule, answers);

  await prisma.quizAttempt.create({
    data: {
      userId: session.userId,
      moduleId,
      score,
      total,
      passed,
    },
  });

  revalidatePath("/quiz");
  revalidatePath(`/quiz/${moduleId}`);

  const attemptsRemaining = Math.max(
    0,
    MAX_ATTEMPTS - (progress.attemptsUsed + 1)
  );

  return { score, total, passed, attemptsRemaining };
}
