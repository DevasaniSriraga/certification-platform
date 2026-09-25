-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN     "answers" JSONB NOT NULL DEFAULT '{}';
