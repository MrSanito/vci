import { getExamAnalytics } from "@/app/actions/examAnalyticsActions";
import { getStudents } from "@/app/actions/studentActions";
import { redirect } from "next/navigation";
import AssignExamForm from "../../../components/admin/AssignExamForm";
import DeleteExamButton from "../../../components/admin/DeleteExamButton";
import AdminQuestionEditor from "@/app/components/admin/AdminQuestionEditor";

export default async function ExamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const analytics = await getExamAnalytics(resolvedParams.id);
  
  if (!analytics || !analytics.exam) {
    redirect('/admin/exams');
  }

  const students = await getStudents();
  const studentMap = new Map<string, any>(students.map((s: any) => [s.clerkId, s]));

  const completionPct = analytics.assignedCount > 0 
    ? ((analytics.completedCount / analytics.assignedCount) * 100).toFixed(0) 
    : '0';

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-24 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/5 pb-10">
          <div>
            <span className="text-[#FF007F] text-[10px] font-bold tracking-[0.4em] uppercase mb-3 block italic">Exam Analytics</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-heading tracking-tighter leading-none italic">{analytics.exam.title}</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic">{analytics.exam.description}</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <a href={`/exam/${analytics.exam._id}`} className="h-12 px-8 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 rounded-xl hover:bg-white hover:text-black transition-all italic">
              ▶ Preview
            </a>
            <DeleteExamButton examId={analytics.exam._id.toString()} examTitle={analytics.exam.title} />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Assigned', val: analytics.assignedCount, color: 'text-white' },
            { label: `Completed (${completionPct}%)`, val: analytics.completedCount, color: 'text-[#FF007F]' },
            { label: 'In Progress', val: analytics.inProgressCount, color: 'text-yellow-400' },
            { label: 'Not Started', val: analytics.notStartedCount, color: 'text-zinc-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
              <div className={`text-3xl font-bold mb-2 font-heading italic ${stat.color}`}>{stat.val}</div>
              <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Average Score', val: `${analytics.avgScore.toFixed(1)} / ${analytics.exam.totalMarks}`, color: 'text-[#FF007F]' },
            { label: 'Passed', val: analytics.passCount, color: 'text-green-400' },
            { label: 'Failed', val: analytics.failCount, color: 'text-red-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-2xl">
              <div className={`text-3xl font-bold mb-2 font-heading italic ${stat.color}`}>{stat.val}</div>
              <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Student-wise Status */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6 sm:p-10 rounded-[3rem] mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-8 font-heading italic uppercase border-b border-white/5 pb-6">Student Status</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3 min-w-[600px]">
              <thead>
                <tr className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest italic">
                  <th className="pb-4 pl-4">Student Name</th>
                  <th className="pb-4">Roll Number</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Score</th>
                  <th className="pb-4">Time Taken</th>
                  <th className="pb-4">Tab Switches</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {analytics.assignedStudentIds.map((studentId: string) => {
                  const student = studentMap.get(studentId) as any;
                  const result = analytics.results.find((r: any) => r.studentId === studentId);
                  const attempt = analytics.attempts.find((a: any) => a.studentId === studentId);
                  
                  return (
                    <tr key={studentId} className="bg-black group hover:bg-[#0A0A0A] transition-all">
                      <td className="py-5 pl-6 pr-4 rounded-l-2xl border-y border-l border-white/5 font-bold text-white italic group-hover:border-[#FF007F]/20">{student?.name || 'Unknown'}</td>
                      <td className="py-5 border-y border-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest italic group-hover:border-[#FF007F]/20">{student?.rollNumber || '-'}</td>
                      <td className="py-5 border-y border-white/5 group-hover:border-[#FF007F]/20">
                        {result ? (
                          <span className="px-4 py-1.5 bg-[#FF007F] text-white text-[9px] font-bold uppercase tracking-widest rounded-lg italic">Done</span>
                        ) : attempt && !attempt.submitted ? (
                          <span className="px-4 py-1.5 bg-yellow-500 text-black text-[9px] font-bold uppercase tracking-widest rounded-lg italic">In Progress</span>
                        ) : (
                          <span className="px-4 py-1.5 bg-white/5 text-zinc-600 text-[9px] font-bold uppercase tracking-widest rounded-lg italic">Not Started</span>
                        )}
                      </td>
                      <td className="py-5 border-y border-white/5 font-bold text-white italic group-hover:border-[#FF007F]/20">
                        {result ? `${result.totalScore}/${result.totalMarks}` : '-'}
                      </td>
                      <td className="py-5 border-y border-white/5 text-zinc-500 italic text-[10px] group-hover:border-[#FF007F]/20">
                        {result ? `${Math.floor(result.totalTimeTaken / 60)}m` : '-'}
                      </td>
                      <td className="py-5 border-y border-white/5 text-yellow-400 font-bold group-hover:border-[#FF007F]/20">
                        {result ? result.tabSwitchCount : attempt?.tabSwitchCount || 0}
                      </td>
                      <td className="py-5 rounded-r-2xl border-y border-r border-white/5 group-hover:border-[#FF007F]/20">
                        {result && (
                          <a href={`/results/${result._id}`} className="px-6 py-2 bg-[#FF007F10] border border-[#FF007F30] text-[#FF007F] text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#FF007F] hover:text-white transition-all italic">
                            View Score
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manage Questions */}
        <div className="mb-12">
          <AdminQuestionEditor 
            examId={resolvedParams.id}
            initialSections={analytics.exam.sections || []}
          />
        </div>

        {/* Assign Students */}
        <div className="mb-8">
          <AssignExamForm 
            examId={resolvedParams.id} 
            students={students}
            currentlyAssigned={analytics.exam.assignedTo || []}
          />
        </div>

        {/* Top Performers */}
        {analytics.results.length > 0 && (
          <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-xl">
            <h2 className="text-xl font-bold text-white mb-10 font-heading italic uppercase border-b border-white/5 pb-8">🏆 Top Performers</h2>
            <div className="space-y-4">
              {analytics.results.slice(0, 5).map((result: any, idx: number) => {
                const student = studentMap.get(result.studentId) as any;
                return (
                  <div key={result._id} className="flex items-center gap-5 p-6 bg-black border border-white/5 rounded-2xl hover:border-[#FF007F]/30 transition-all group">
                    <div className={`text-2xl font-bold font-heading italic ${
                      idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-zinc-600'
                    }`}>#{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold group-hover:text-[#FF007F] transition-colors italic truncate">{student?.name || 'Unknown'}</div>
                      <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">{student?.rollNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#FF007F] font-bold italic">{result.totalScore}/{result.totalMarks}</div>
                      <div className="text-[9px] text-zinc-500 italic">{result.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
