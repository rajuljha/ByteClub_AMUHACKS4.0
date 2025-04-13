
import QuizCard from "./QuizCard";

interface QuizGridProps {
  quizzes: any[];
}

const QuizGrid = ({ quizzes }: QuizGridProps) => {
  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-dashed">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No quizzes created yet</h3>
        <p className="text-sm text-gray-500 max-w-md text-center mb-2">
          Create your first quiz by clicking the "Create Quiz" button above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
};

export default QuizGrid;
