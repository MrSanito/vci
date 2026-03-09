import { getExamById } from "@/app/actions/examActions";
import { startExamAttempt, getExamAttempt } from "@/app/actions/examAttemptActions";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ExamInterface from "../../../components/exam/ExamInterface";

export default async function ExamTestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  console.log(`[ExamTestPage] Loading preview for exam id: ${resolvedParams.id}`);
  const user = await currentUser();
  const sessionClaims = (await auth()).sessionClaims as any;
  if (!user) {
    console.log(`[ExamTestPage] user not found, redirecting to sign-in`);
    redirect('/sign-in');
  }

  const role = sessionClaims?.metadata?.role;
  const isAdmin = role === 'admin';
  console.log(`[ExamTestPage] User is Admin: ${isAdmin}`);

  const exam = await getExamById(resolvedParams.id);
  if (!exam) {
    console.log(`[ExamTestPage] getExamById failed to find exam!`);
    return <div>Exam not found in database! Make sure your new MongoDB cluster has the exam.</div>;
  }

  // Start or resume attempt
  console.log(`[ExamTestPage] Calling startExamAttempt...`);
  const attemptResult = await startExamAttempt(resolvedParams.id, isAdmin);
  console.log(`[ExamTestPage] startExamAttempt result:`, attemptResult);
  
  if (!attemptResult.success || !attemptResult.attemptId) {
    return <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-red-400 font-bold text-xl">Preview Failed to Start</p>
      <p className="text-slate-300">{attemptResult.message}</p>
      <p className="text-sm text-yellow-500">Check your terminal console logs for more exact failure reasons.</p>
    </div>;
  }

  const attempt = await getExamAttempt(attemptResult.attemptId);
  if (!attempt) {
    return <div>Error loading attempt</div>;
  }

  return <ExamInterface exam={exam} attemptId={attemptResult.attemptId} initialAttempt={attempt} />;
}
