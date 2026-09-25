import type { ReviewItem } from "@/app/lib/quiz-data";

export function QuizReviewList({ review }: { review: ReviewItem[] }) {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <h2 className="text-lg font-medium">Review your answers</h2>
      {review.map((item, i) => {
        const reveal = item.correctIndex !== undefined;
        return (
          <div
            key={item.questionId}
            className={`rounded border p-4 ${
              item.correct
                ? "border-green-300 bg-green-50"
                : "border-red-300 bg-red-50"
            }`}
          >
            <p className="font-medium">
              {i + 1}. {item.text}
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-sm">
              {item.options.map((option, idx) => {
                const isSelected = idx === item.selectedIndex;
                const isCorrectOption = reveal && idx === item.correctIndex;

                let className = "text-gray-600";
                if (isSelected && item.correct) {
                  className = "font-semibold text-green-800";
                } else if (isSelected && !item.correct) {
                  className = "font-semibold text-red-800 line-through";
                } else if (isCorrectOption) {
                  className = "font-semibold text-green-800";
                }

                return (
                  <li key={idx} className={className}>
                    {isSelected ? "→ " : ""}
                    {option}
                    {isCorrectOption && !isSelected ? " (correct answer)" : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
