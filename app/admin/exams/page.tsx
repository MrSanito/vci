import { getExams } from "../../actions/examActions";
import Link from "next/link";
import DeleteExamButton from "../../components/admin/DeleteExamButton";

export default async function ExamsPage() {
  const exams = await getExams();

  return (
    <div className="min-h-screen pt-10 pb-24 px-4 sm:px-8 lg:px-16 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 border-b border-white/5 pb-10">
          <div>
            <span className="text-[#FF007F] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block italic">All Exams</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 font-heading tracking-tighter leading-none italic">
              Exam <span className="text-[#FF007F]">List.</span>
            </h1>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em] italic">Manage, edit, and assign exams to your students.</p>
          </div>
          <Link href="/admin/exams/new" className="h-14 px-10 bg-[#FF007F] text-white text-[10px] font-bold tracking-[0.3em] uppercase shadow-2xl flex items-center justify-center gap-4 rounded-2xl hover:bg-white hover:text-black transition-all active:scale-95 italic shrink-0 shadow-[0_0_30px_-10px_#FF007F]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Create New Exam
          </Link>
        </div>

        <div className="grid gap-10">
          {exams.length === 0 ? (
            <div className="py-32 text-center bg-[#0A0A0A] border-2 border-dashed border-white/10 rounded-[3rem]">
              <div className="w-20 h-20 bg-white/5 text-[#FF007F] rounded-[2rem] flex items-center justify-center mx-auto mb-10 font-bold text-4xl italic rotate-12">!</div>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.35em] italic">No exams found. Create your first exam.</p>
              <Link href="/admin/exams/new" className="mt-10 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#FF007F] hover:text-white transition-colors underline underline-offset-8">Create Exam →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exams.map((exam: any) => (
                <div key={exam._id} className="group bg-[#0A0A0A] border border-white/5 hover:border-[#FF007F]/30 transition-all duration-500 rounded-[3rem] p-8 shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(255,0,127,0.1)] relative overflow-hidden">
                  <div className="flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-8">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#FF007F] mb-3 font-heading tracking-tight transition-colors italic uppercase leading-tight truncate">{exam.title}</h3>
                        <p className="text-[10px] text-zinc-600 font-bold line-clamp-2 uppercase tracking-[0.1em] leading-relaxed italic">{exam.description || "No description added."}</p>
                      </div>
                      <div className="w-12 h-12 bg-[#FF007F10] group-hover:bg-[#FF007F] text-[#FF007F] group-hover:text-white rounded-xl flex items-center justify-center font-bold text-xs transition-all italic rotate-6 shrink-0 ml-4">
                        V
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-5 bg-black border border-white/5 rounded-2xl">
                        <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic block mb-2">Sections</span>
                        <span className="text-base font-bold text-white italic">{exam.sections?.length || 0}</span>
                      </div>
                      <div className="p-5 bg-black border border-white/5 rounded-2xl">
                        <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic block mb-2">Duration</span>
                        <span className="text-base font-bold text-white italic">{exam.totalDuration} Min</span>
                      </div>
                      <div className="p-5 bg-black border border-white/5 rounded-2xl">
                        <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic block mb-2">Total Marks</span>
                        <span className="text-base font-bold text-[#FF007F] italic">{exam.totalMarks}</span>
                      </div>
                      <div className="p-5 bg-black border border-white/5 rounded-2xl">
                        <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic block mb-2">Assigned</span>
                        <span className="text-base font-bold text-white italic">{exam.assignedTo?.length || 0} Students</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex gap-4 pt-6 border-t border-white/5">
                      <Link href={`/admin/exams/${exam._id}`} className="flex-1 h-12 bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.2em] flex items-center justify-center rounded-xl hover:bg-[#FF007F] hover:border-[#FF007F] transition-all italic">
                        Edit & Assign
                      </Link>
                      <Link href={`/exam/${exam._id}`} className="flex-1 h-12 border border-white/10 text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center justify-center rounded-xl hover:bg-white hover:text-black transition-all italic">
                        Preview
                      </Link>
                      <DeleteExamButton examId={exam._id.toString()} examTitle={exam.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
