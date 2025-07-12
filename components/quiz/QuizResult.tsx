interface Result {
  score: number;
  totalQuestions: number;
  percentage: number;
  attemptedAt?: string;
}

export default function QuizResult({ result }: { result: Result }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
      <div className="bg-green-900/30 p-10 rounded-3xl text-center border border-green-500/30 max-w-xl">
        <h2 className="text-3xl font-bold text-green-400 mb-4">
          Quiz Submitted
        </h2>
        <p className="text-lg mb-2">
          Score: {result.score}/{result.totalQuestions}
        </p>
        <p className="text-lg mb-2">Percentage: {result.percentage}%</p>
        <p className="text-lg">
          {result.percentage >= 80
            ? "🎉 Excellent!"
            : result.percentage >= 60
            ? "👍 Good Job!"
            : "📚 Keep Practicing!"}
        </p>
        {result.attemptedAt && (
          <p className="text-sm text-gray-400 mt-2">
            Attempted At: {new Date(result.attemptedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
