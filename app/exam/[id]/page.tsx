import { getExamById } from "@/app/actions/examActions";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import StartTestButton from "../../components/exam/StartTestButton";
import ExamAttempt from "@/app/models/ExamAttempt";
import connectToDatabase from "@/app/lib/db";

export default async function ExamInstructionsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const resolvedParams = await params;
  const exam = await getExamById(resolvedParams.id);
  if (!exam) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
        <div className="bg-[#0A0A0A] border border-white/10 max-w-md w-full text-center py-20 rounded-[3rem] shadow-2xl">
          <div className="w-16 h-16 bg-white/5 text-[#FF007F] rounded-2xl flex items-center justify-center mx-auto mb-8 font-bold text-2xl italic rotate-6 border border-white/5 animate-pulse">!</div>
          <h2 className="text-3xl font-bold text-white mb-4 font-heading tracking-tight italic">Exam Not Found</h2>
          <p className="text-zinc-600 mb-10 font-bold text-[10px] uppercase tracking-widest px-8 italic">This exam could not be found. Please check your dashboard.</p>
          <Link href="/dashboard" className="mx-8 h-14 bg-[#FF007F] text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:text-black transition-all italic shadow-[0_0_20px_-5px_#FF007F]">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const totalQuestions = exam.sections.reduce((sum: number, section: any) => 
    sum + section.questions.length, 0
  );

  await connectToDatabase();
  const existingAttempt = await ExamAttempt.findOne({ examId: resolvedParams.id, studentId: user.id }).lean();
  const isResume = existingAttempt && !(existingAttempt as any).submitted;

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-8 pb-32 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Exam Header Card */}
        <div className="bg-[#0A0A0A] border border-white/5 mb-8 overflow-hidden rounded-[3rem] shadow-2xl p-8 sm:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-white/5 pb-10 mb-10">
            <div>
              <span className="text-[#FF007F] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block italic leading-none">Exam Instructions</span>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-heading tracking-tighter mb-3 leading-tight italic">{exam.title}</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-loose italic">{exam.description || "Read the instructions carefully before starting."}</p>
            </div>
            <div className="p-8 bg-black border border-white/10 text-white rounded-[2rem] flex flex-col items-start gap-2 shadow-xl shrink-0">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Student</span>
              <span className="text-xl font-bold tracking-tight italic font-heading">{user.firstName} {user.lastName}</span>
            </div>
          </div>

          {/* Exam Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="p-6 bg-black border border-white/5 rounded-2xl">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-2 italic">Questions</span>
              <p className="text-3xl font-bold text-white font-heading italic">{totalQuestions}</p>
            </div>
            <div className="p-6 bg-black border border-white/5 rounded-2xl">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-2 italic">Total Marks</span>
              <p className="text-3xl font-bold text-[#FF007F] font-heading italic">{exam.totalMarks}</p>
            </div>
            <div className="p-6 bg-black border border-white/5 rounded-2xl">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-2 italic">Time Limit</span>
              <p className="text-3xl font-bold text-white font-heading italic">{exam.totalDuration} Min</p>
            </div>
            <div className="p-6 bg-black border border-white/5 rounded-2xl">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-2 italic">Sections</span>
              <p className="text-3xl font-bold text-white font-heading italic">{exam.sections.length}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Instructions */}
          <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-xl">
            <div className="flex items-center gap-5 mb-10 border-b border-white/5 pb-8">
              <div className="w-10 h-10 bg-[#FF007F] text-white rounded-xl flex items-center justify-center font-bold text-lg italic rotate-6 shadow-[0_0_15px_-5px_#FF007F]">!</div>
              <h2 className="text-2xl font-bold text-white font-heading tracking-tight italic uppercase">Important Rules</h2>
            </div>
            
            <div className="space-y-8 text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] leading-relaxed italic">
              {[
                { num: "01", text: <>Sit in a quiet place. <span className="text-white">Avoid all distractions.</span></> },
                { num: "02", text: <>The timer starts when you click <span className="text-white">Start Test.</span> You have {exam.totalDuration} minutes.</> },
                { num: "03", text: <>This exam has <span className="text-white">{exam.sections.length} section(s).</span> You can navigate between questions freely.</> },
                { num: "04", text: <>Do not switch tabs. <span className="text-white">Tab switches are recorded.</span></> },
                { num: "05", text: <>Your answers are <span className="text-white">saved automatically every 30 seconds.</span></> },
                { num: "06", text: <>Once submitted, <span className="text-white">the exam cannot be taken again.</span></> },
              ].map(item => (
                <div key={item.num} className="flex items-start gap-5">
                  <span className="text-[#FF007F] text-xl shrink-0">{item.num}.</span>
                  <p className="pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Overview & Start */}
          <div className="space-y-8">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-xl">
              <h2 className="text-xl font-bold text-white mb-8 font-heading tracking-tight italic uppercase border-b border-white/5 pb-6">Sections in this Exam</h2>
              <div className="space-y-4">
                {exam.sections.map((section: any, idx: number) => {
                  const sectionMarks = section.questions.reduce((sum: number, q: any) => sum + q.marks, 0);
                  return (
                    <div key={idx} className="flex justify-between items-center p-5 bg-black border border-white/5 rounded-2xl hover:border-[#FF007F]/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-[#FF007F] text-white flex items-center justify-center font-bold text-xs italic group-hover:rotate-12 transition-transform shadow-[0_0_10px_-5px_#FF007F]">{idx + 1}</div>
                        <div>
                          <p className="text-white font-bold text-sm leading-none italic uppercase">{section.name}</p>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic mt-1">{section.questions.length} Questions</p>
                        </div>
                      </div>
                      <p className="text-[#FF007F] font-bold font-heading italic text-lg">{sectionMarks} <span className="text-[10px] opacity-40 font-normal">Marks</span></p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Start Button */}
            <div className="bg-[#0A0A0A] border border-[#FF007F20] rounded-[3rem] p-10 flex flex-col items-center text-center shadow-[0_0_60px_-20px_rgba(255,0,127,0.2)]">
              <div className="w-16 h-16 bg-[#FF007F] text-white rounded-2xl flex items-center justify-center font-bold text-3xl rotate-12 mb-8 italic shadow-[0_0_30px_-5px_#FF007F]">V</div>
              <h3 className="text-white text-2xl font-bold font-heading tracking-tight mb-3 italic">
                {isResume ? 'Continue your exam?' : 'Ready to start?'}
              </h3>
              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.3em] leading-loose mb-10 px-6 italic">
                {isResume ? 'You have an exam in progress. Continue from where you left off.' : 'By clicking start, you agree to the rules above.'}
              </p>
              <div className="w-full">
                <StartTestButton examId={exam._id.toString()} isResume={isResume} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
