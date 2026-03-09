import { getExamById } from "@/app/actions/examActions";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ExamInstructionsPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const exam = await getExamById(params.id);
  if (!exam) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-white">Exam not found</p>
    </div>;
  }

  // Calculate total questions
  const totalQuestions = exam.sections.reduce((sum: number, section: any) => 
    sum + section.questions.length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-panel p-8 rounded-2xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{exam.title}</h1>
              <p className="text-slate-400">{exam.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Candidate</p>
              <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-blue-400 text-sm">{user.id}</p>
            </div>
          </div>

          {/* Exam Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-slate-800/50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{totalQuestions}</p>
              <p className="text-xs text-slate-400">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{exam.totalMarks}</p>
              <p className="text-xs text-slate-400">Total Marks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{exam.totalDuration}</p>
              <p className="text-xs text-slate-400">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{exam.sections.length}</p>
              <p className="text-xs text-slate-400">Sections</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-panel p-8 rounded-2xl mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📋 General Instructions</h2>
          
          <div className="space-y-3 text-slate-300">
            <p>1. The exam will be conducted in <strong>fullscreen mode</strong>. Exiting fullscreen will trigger a warning.</p>
            <p>2. Total duration: <strong>{exam.totalDuration} minutes</strong>. Timer starts when you click "Start Test".</p>
            <p>3. The exam contains <strong>{exam.sections.length} sections</strong>:</p>
            <ul className="ml-6 space-y-1">
              {exam.sections.map((section: any, idx: number) => (
                <li key={idx}>
                  • <strong>{section.name}</strong>: {section.questions.length} questions
                </li>
              ))}
            </ul>
            <p>4. You can navigate between questions using the question palette on the right.</p>
            <p>5. Questions can be marked for review and revisited anytime before submission.</p>
            <p>6. <strong className="text-red-400">Warning:</strong> Switching tabs will be tracked. After 10 tab switches, the exam will auto-submit.</p>
            <p>7. Your answers are auto-saved every 30 seconds.</p>
            <p>8. Click "Submit Test" when you're done. You cannot change answers after submission.</p>
          </div>
        </div>

        {/* Section Details */}
        <div className="glass-panel p-8 rounded-2xl mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📚 Section-wise Breakdown</h2>
          
          <div className="space-y-3">
            {exam.sections.map((section: any, idx: number) => {
              const sectionMarks = section.questions.reduce((sum: number, q: any) => sum + q.marks, 0);
              return (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">{section.name}</p>
                    <p className="text-sm text-slate-400">{section.questions.length} questions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{sectionMarks} marks</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agreement */}
        <div className="glass-panel p-8 rounded-2xl">
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-primary mt-1" id="agree" required />
            <span className="text-slate-300">
              I have read and understood all the instructions. I am ready to begin the test.
            </span>
          </label>

          <Link 
            href={`/exam/${exam._id}/test`}
            className="btn btn-primary btn-lg w-full"
            onClick={(e) => {
              const checkbox = document.getElementById('agree') as HTMLInputElement;
              if (!checkbox?.checked) {
                e.preventDefault();
                alert('Please accept the instructions to continue');
              }
            }}
          >
            🚀 Start Test
          </Link>
        </div>
      </div>
    </div>
  );
}
