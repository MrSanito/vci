import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getStudentDashboardData } from '../actions/dashboardActions';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/login');
  }

  const data = await getStudentDashboardData();

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
        <div className="bg-[#0A0A0A] border border-white/10 max-w-lg w-full text-center py-20 rounded-[3.5rem] shadow-2xl">
           <div className="w-20 h-20 bg-white/5 text-[#FF007F] rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-inner font-extrabold text-4xl italic rotate-6 border border-white/5 animate-pulse">!</div>
          <h2 className="text-4xl font-extrabold text-white mb-6 font-heading tracking-tighter uppercase italic">Error.</h2>
          <p className="text-zinc-600 mb-12 font-bold leading-relaxed text-[11px] uppercase tracking-[0.4em] px-12 italic">Unable to load your dashboard data right now.</p>
          <Link href="/login" className="mx-12 h-16 bg-[#FF007F] text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.5em] rounded-2xl hover:bg-white hover:text-black transition-all italic shadow-[0_0_30px_-5px_#FF007F]">
            Try Log In Again
          </Link>
        </div>
      </div>
    );
  }

  const { student, attempts, results, stats, isAdmin } = data;

  return (
    <div className="min-h-screen pb-24 bg-black text-white px-4 sm:px-8 lg:px-14">
        <div className="max-w-7xl mx-auto pt-10">
            {/* Simple Student Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-8 mb-10">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#FF007F] text-white flex items-center justify-center font-extrabold text-2xl rounded-2xl shadow-[0_0_20px_-8px_#FF007F] rotate-3 italic shrink-0">
                    {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-[#FF007F] tracking-widest uppercase italic block mb-1">Student Profile</span>
                        <p className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tighter uppercase italic leading-none">Welcome, {student.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5 p-5 bg-[#0A0A0A] border border-white/5 rounded-2xl shadow-xl shrink-0">
                     <div className="flex flex-col items-end">
                        <span className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase italic">Roll No.</span>
                        <span className="text-white text-[11px] font-bold tracking-widest italic mt-1 uppercase">{student.rollNumber}</span>
                     </div>
                     <UserButton afterSignOutUrl="/login" appearance={{ elements: { userButtonAvatarBox: 'w-11 h-11 border-2 border-white/10 shadow-sm hover:border-[#FF007F] transition-all' } }} />
                </div>
            </div>

            {isAdmin && (
                <div className="mb-8 bg-[#0A0A0A] border border-[#FF007F40] p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#FF007F] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-[0_0_15px_-5px_#FF007F] rotate-12 italic shrink-0">R</div>
                        <div>
                            <p className="font-bold tracking-widest text-sm uppercase italic text-white leading-none mb-1">Admin Viewer Mode</p>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest italic">Viewing as a student.</p>
                        </div>
                    </div>
                    <Link href="/admin" className="px-8 h-12 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#FF007F] hover:text-white transition-all active:scale-95 flex items-center italic shrink-0">
                        Back to Admin
                    </Link>
                </div>
            )}

            <div className="grid lg:grid-cols-12 gap-8 mb-10 items-stretch">
                <div className="lg:col-span-8">
                    <div className="bg-[#0A0A0A] border border-white/5 p-6 sm:p-10 rounded-3xl h-full shadow-xl">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8 border-b border-white/5 pb-8">
                            <div className="min-w-0">
                                <span className="text-[#FF007F] font-bold tracking-widest uppercase mb-3 block text-[9px] italic">Student Info</span>
                                <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tighter mb-3 italic leading-none truncate">{student.name}</h2>
                                <div className="flex flex-wrap gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                    <span className="text-white/40 italic truncate max-w-[200px]">{student.email}</span>
                                    <span className="text-[#FF007F] italic">{student.course}</span>
                                </div>
                            </div>
                            <div className="px-5 py-2.5 bg-black border border-[#FF007F30] text-[#FF007F] text-[10px] font-bold uppercase tracking-widest rounded-xl italic shrink-0">
                                Online
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Assigned', val: stats.totalExams, color: 'text-white' },
                                { label: 'Completed', val: stats.completedExams, color: 'text-[#FF007F]' },
                                { label: 'Average', val: `${stats.averageScore}%`, color: 'text-white' },
                                { label: 'Pending', val: stats.pendingExams, color: 'text-zinc-700' },
                            ].map((stat, i) => (
                                <div key={i} className="p-5 bg-black/40 border border-white/5 rounded-2xl hover:border-[#FF007F20] transition-all">
                                    <div className={`text-3xl font-extrabold mb-2 tracking-tighter font-heading italic ${stat.color}`}>{stat.val}</div>
                                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center shadow-xl group hover:border-[#FF007F]/30 transition-all relative overflow-hidden min-h-[200px]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF007F05] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-16 h-16 bg-[#FF007F] text-white font-extrabold text-3xl flex items-center justify-center rounded-2xl mb-8 shadow-[0_0_30px_-10px_#FF007F] rotate-12 group-hover:rotate-0 transition-transform italic">V</div>
                        <h3 className="text-white text-2xl font-extrabold font-heading tracking-tighter mb-4 uppercase italic leading-none">QUICK <span className="text-[#FF007F]">LINKS.</span></h3>
                        <p className="text-zinc-600 text-[9px] font-bold px-4 mb-6 uppercase tracking-widest italic">Access your exams and results here.</p>
                        <span className="text-[9px] text-[#FF007F] font-bold uppercase tracking-widest italic animate-pulse">System Online</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                {/* Exam List */}
                <div className="bg-[#0A0A0A] border border-white/5 p-6 sm:p-10 rounded-3xl shadow-xl">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tighter italic uppercase leading-none mb-2">My Exams.</h3>
                            <p className="text-[10px] text-[#FF007F] font-bold uppercase tracking-widest italic">Select an exam to start</p>
                        </div>
                        <div className="w-12 h-12 bg-white/5 text-zinc-700 rounded-2xl flex items-center justify-center border border-white/5 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                        </div>
                    </div>
                    
                    {attempts.length === 0 ? (
                        <div className="text-center py-16 bg-black/40 rounded-2xl border border-dashed border-white/5">
                            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic">No exams assigned yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {attempts.map((attempt: any) => (
                                <div key={attempt._id} className="p-6 bg-black border border-white/5 rounded-2xl hover:border-[#FF007F]/30 transition-all">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-extrabold text-white tracking-tight text-lg mb-1 italic uppercase truncate">{attempt.examId.title}</h4>
                                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest line-clamp-1 italic mb-4">{attempt.examId.description}</p>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="px-4 py-2 bg-white/5 text-zinc-500 text-[9px] font-bold uppercase tracking-widest rounded-xl border border-white/5 italic">⏱️ {attempt.examId.duration}M</span>
                                                <span className="px-4 py-2 bg-[#FF007F10] text-[#FF007F] text-[9px] font-bold uppercase tracking-widest rounded-xl border border-[#FF007F20] italic">🎯 {attempt.examId.totalMarks} Marks</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 shrink-0">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest italic ${
                                                attempt.status === 'completed' ? 'bg-[#FF007F] text-white' :
                                                attempt.status === 'in-progress' ? 'bg-white text-black' :
                                                'bg-zinc-900 text-zinc-700'
                                            }`}>
                                                {attempt.status}
                                            </span>
                                            <Link 
                                                href={`/exam/${attempt._id}`}
                                                className="px-8 h-11 bg-[#FF007F] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all active:scale-95 flex items-center italic shadow-[0_0_15px_-5px_#FF007F] whitespace-nowrap"
                                            >
                                                Start Test
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="bg-[#0A0A0A] border border-white/5 p-6 sm:p-10 rounded-3xl shadow-xl">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tighter italic uppercase leading-none mb-2">My Results.</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic">Your performance history</p>
                        </div>
                        <div className="w-12 h-12 bg-white/5 text-zinc-800 rounded-2xl flex items-center justify-center border border-white/5 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                    </div>
                    
                    {results.length === 0 ? (
                        <div className="text-center py-16 bg-black/40 rounded-2xl border border-dashed border-white/5">
                            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic">No results yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {results.slice(0, 5).map((result: any) => (
                                <div key={result._id} className="p-5 sm:p-6 bg-black/40 border border-white/5 rounded-2xl hover:bg-black hover:border-[#FF007F]/20 transition-all group">
                                    <div className="flex items-start justify-between gap-5 mb-5">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg rotate-6 italic group-hover:rotate-0 transition-all shrink-0 ${result.passed ? 'bg-[#FF007F] text-white' : 'bg-red-600 text-white'}`}>
                                                {result.passed ? '✓' : '✗'}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-extrabold text-white tracking-tight text-base uppercase italic truncate group-hover:text-[#FF007F] transition-colors">{result.examId.title}</h4>
                                                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">{new Date(result.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <span className={`text-3xl font-extrabold font-heading italic tracking-tighter shrink-0 ${result.passed ? 'text-[#FF007F]' : 'text-red-600'}`}>{result.percentage}%</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                                        <div className="flex gap-5 text-[9px] font-bold uppercase tracking-widest text-zinc-700 italic">
                                            <span>Score: <span className="text-white">{result.score}</span></span>
                                            <span>Time: <span className="text-white">{result.timeTaken}M</span></span>
                                        </div>
                                        <Link 
                                            href={`/results/${result.attemptId}`}
                                            className="text-[9px] font-bold uppercase tracking-widest text-[#FF007F] hover:text-white transition-all italic"
                                        >
                                            View Score →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
