import { getExamResult } from "@/app/actions/examResultActions";
import { getExamById } from "@/app/actions/examActions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const result = await getExamResult(resolvedParams.id);
  if (!result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
        <div className="bg-[#0A0A0A] border border-white/10 max-w-md w-full text-center py-20 rounded-[3rem] shadow-2xl">
          <div className="w-16 h-16 bg-white/5 text-[#FF007F] rounded-2xl flex items-center justify-center mx-auto mb-8 font-bold text-2xl italic rotate-6 border border-white/5 animate-pulse">!</div>
          <h2 className="text-3xl font-bold text-white mb-4 font-heading tracking-tight italic">Result Not Found</h2>
          <p className="text-zinc-600 mb-10 font-bold text-[10px] uppercase tracking-widest px-8 italic">We could not find the result for this exam.</p>
          <Link href="/dashboard" className="mx-8 h-14 bg-[#FF007F] text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:text-black transition-all italic shadow-[0_0_20px_-5px_#FF007F]">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const exam = await getExamById(result.examId);

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-8 pb-32 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Score Header */}
        <div className="bg-[#0A0A0A] border border-white/5 mb-8 overflow-hidden rounded-[3rem] shadow-2xl p-8 sm:p-12 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-white/5 pb-10 mb-10">
            <div>
              <span className="text-[#FF007F] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block italic leading-none">Exam Result</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-heading tracking-tight mb-2 leading-none italic">Your Score Card.</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] italic">{exam?.title || "Exam"}</p>
            </div>
            <div className={`px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl ${result.passed ? 'bg-green-600 text-white shadow-green-900/40' : 'bg-red-600 text-white shadow-red-900/40'}`}>
              {result.passed ? '✓ PASSED' : '✗ FAILED'}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="flex-1 w-full">
              <div className="flex items-end gap-6 mb-8">
                <span className={`text-8xl md:text-9xl font-bold font-heading leading-none italic ${result.passed ? 'text-green-500' : 'text-red-500'}`}>{result.percentage.toFixed(0)}%</span>
                <div className="mb-3">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 leading-none italic">Your Score</p>
                  <p className="text-4xl font-bold text-white font-heading italic">{result.totalScore} <span className="opacity-20 text-xl font-normal">/ {result.totalMarks}</span></p>
                </div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <div className={`h-full ${result.passed ? 'bg-green-500' : 'bg-red-500'} transition-all duration-1000`} style={{ width: `${result.percentage}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 w-full lg:w-auto">
              <div className="p-8 bg-black border border-white/5 rounded-2xl">
                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-2 italic">Time Taken</span>
                <p className="text-2xl font-bold text-white font-heading italic">{Math.floor(result.totalTimeTaken / 60)}m {result.totalTimeTaken % 60}s</p>
              </div>
              <div className="p-8 bg-black border border-white/5 rounded-2xl">
                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mb-2 italic">Rank</span>
                <p className="text-2xl font-bold text-white font-heading italic">#{result.rank || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Section Breakdown & Questions */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-xl">
              <h2 className="text-xl font-bold text-white mb-10 font-heading tracking-tight italic uppercase border-b border-white/5 pb-8">Section Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-4">
                  <thead>
                    <tr>
                      <th className="text-left text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 pb-6 italic">Section</th>
                      <th className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 pb-6 italic">Attempted</th>
                      <th className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 pb-6 italic">Correct</th>
                      <th className="text-right text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 pb-6 italic">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.sectionScores.map((section: any, idx: number) => (
                      <tr key={idx} className="group">
                        <td className="py-6 border-y border-white/5 rounded-l-2xl pl-6">
                          <p className="text-sm font-bold text-white italic">{section.sectionName}</p>
                          <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                            <div className="bg-[#FF007F] h-full" style={{ width: `${section.accuracy}%` }}></div>
                          </div>
                        </td>
                        <td className="py-6 text-center text-[11px] font-bold text-zinc-500 uppercase tracking-widest italic border-y border-white/5">{section.attempted} Qs</td>
                        <td className="py-6 text-center border-y border-white/5">
                          <span className="px-5 py-2 bg-green-600/10 text-green-400 border border-green-600/20 rounded-xl text-[10px] font-bold italic">{section.correct} Correct</span>
                        </td>
                        <td className="py-6 text-right pr-6 border-y rounded-r-2xl border-white/5">
                          <p className="text-xl font-bold text-white font-heading italic">{section.score} <span className="text-xs opacity-20 font-normal">/ {section.totalMarks}</span></p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Question Details */}
            <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-xl">
              <h2 className="text-xl font-bold text-white mb-10 font-heading tracking-tight italic uppercase border-b border-white/5 pb-8">Question-wise Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                {result.questionResults.map((qResult: any, idx: number) => (
                  <div key={idx} className={`p-8 rounded-[2rem] border-2 transition-all ${
                    qResult.studentAnswer === null ? 'bg-black/40 border-white/5 opacity-60' :
                    qResult.isCorrect ? 'bg-black border-green-600/30' : 'bg-black border-red-600/30'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 italic ${
                          qResult.studentAnswer === null ? 'bg-white/5 text-zinc-600' :
                          qResult.isCorrect ? 'bg-green-600 text-white shadow-xl' : 'bg-red-600 text-white shadow-xl'
                        }`}>
                          #{qResult.questionNum + 1}
                        </div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] italic">{qResult.section}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest italic ${qResult.marksAwarded > 0 ? 'text-green-400' : 'text-red-500'}`}>
                        {qResult.marksAwarded > 0 ? '+' : ''}{qResult.marksAwarded} Marks
                      </span>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest leading-none italic block mb-2">Your Answer:</span>
                        <p className={`text-xs font-bold uppercase tracking-widest italic ${qResult.isCorrect ? 'text-white' : 'text-red-400'}`}>
                          {qResult.studentAnswer === null ? 'Not Attempted' : 
                           (Array.isArray(qResult.studentAnswer) ? qResult.studentAnswer.join(', ') : qResult.studentAnswer)}
                        </p>
                      </div>
                      {!qResult.isCorrect && qResult.studentAnswer !== null && (
                        <div className="pt-5 border-t border-white/5">
                          <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest leading-none italic block mb-2">Correct Answer:</span>
                          <p className="text-xs font-bold text-green-400 uppercase tracking-widest italic">
                            {Array.isArray(qResult.correctAnswer) ? qResult.correctAnswer.join(', ') : qResult.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {(result.tabSwitchCount > 0 || result.autoSubmitted) && (
              <div className="bg-[#0A0A0A] border border-red-600/20 p-8 rounded-[2.5rem] shadow-xl">
                <div className="flex items-center gap-5 mb-10 border-b border-white/5 pb-8">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl italic rotate-3 shadow-xl">!</div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-heading italic uppercase">Warnings</h2>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Exam Monitoring Report</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">Tab Switches</span>
                    <span className="text-2xl font-bold text-red-500 font-heading italic">{result.tabSwitchCount}</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">Warnings</span>
                    <span className="text-2xl font-bold text-yellow-500 font-heading italic">{result.warningsIssued}</span>
                  </div>
                  {result.autoSubmitted && (
                    <div className="p-5 bg-red-600/10 border border-red-600/20 rounded-2xl">
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em] leading-relaxed text-center italic">This exam was automatically submitted due to too many tab switches.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
              <h2 className="text-lg font-bold text-white mb-8 font-heading tracking-tight italic uppercase border-b border-white/5 pb-6">What's Next?</h2>
              <div className="space-y-5">
                <Link href="/dashboard" className="w-full h-16 bg-[#FF007F] text-white flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_20px_-5px_#FF007F] hover:bg-white hover:text-black transition-all active:scale-95 group italic">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011-1v4a1 1 0 001-1m-6 0h6" /></svg>
                  Back to Dashboard
                </Link>
                {result.passed && (
                  <button className="w-full h-14 bg-white/5 border border-white/10 text-white gap-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-black flex items-center justify-center transition-all italic">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
