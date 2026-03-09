import { getExamById } from "../../../../actions/examActions";
import { startExamAttempt, getExamAttempt } from "../../../../actions/examAttemptActions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ExamInterface from "../../../components/exam/ExamInterface";

export default async function ExamTestPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const exam = await getExamById(params.id);
  if (!exam) {
    return <div>Exam not found</div>;
  }

  // Start or resume attempt
  const attemptResult = await startExamAttempt(params.id);
  if (!attemptResult.success) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-400">{attemptResult.message}</p>
    </div>;
  }

  const attempt = await getExamAttempt(attemptResult.attemptId);
  if (!attempt) {
    return <div>Error loading attempt</div>;
  }

  return <ExamInterface exam={exam} attemptId={attemptResult.attemptId} initialAttempt={attempt} />;
}
