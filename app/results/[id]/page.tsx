import { getExamResult } from "@/app/actions/examResultActions";
import { getExamById } from "@/app/actions/examActions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ResultPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const result = await getExamResult(params.id);
  if (!result) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-400">Result not found</p>
    </div>;
  }

  const exam = await getExamById(result.examId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Score Card */}
        <div className="glass-panel p-8 rounded-2xl mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Exam Completed!</h1>
          <p className="text-slate-400 mb-6">{exam?.title}</p>
          
          <div className="inline-block">
            <div className="text-6xl font-bold mb-2">
              <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
                {result.totalScore}
              </span>
              <span className="text-slate-400 text-4xl">/{result.totalMarks}</span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-4 mb-4">
              <div 
                className={`h-4 rounded-full ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${result.percentage}%` }}
              ></div>
            </div>
            
            <div className="text-2xl font-bold mb-4">
              <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
                {result.percentage.toFixed(2)}%
              </span>
            </div>
            
            <div className={`badge badge-lg ${result.passed ? 'badge-success' : 'badge-error'} mb-4`}>
              {result.passed ? '✅ PASSED' : '❌ FAILED'}
            </div>
            
            {result.rank && (
              <p className="text-slate-400">
                Rank: <span className="text-yellow-400 font-bold">#{result.rank}</span>
              </p>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="glass-panel p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📊 Performance Summary</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-500/20 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-400">
                {result.questionResults.filter((q: any) => q.isCorrect).length}
              </div>
              <div className="text-sm text-slate-400">Correct</div>
            </div>
            
            <div className="bg-red-500/20 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-400">
                {result.questionResults.filter((q: any) => !q.isCorrect && q.studentAnswer !== null).length}
              </div>
              <div className="text-sm text-slate-400">Incorrect</div>
            </div>
            
            <div className="bg-gray-500/20 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-400">
                {result.questionResults.filter((q: any) => q.studentAnswer === null).length}
              </div>
              <div className="text-sm text-slate-400">Unattempted</div>
            </div>
            
            <div className="bg-blue-500/20 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-400">
                {Math.floor(result.totalTimeTaken / 60)}m
              </div>
              <div className="text-sm text-slate-400">Time Taken</div>
            </div>
          </div>
        </div>

        {/* Section-wise Breakdown */}
        <div className="glass-panel p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📚 Section-wise Performance</h2>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-slate-400">
                  <th>Section</th>
                  <th>Attempted</th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                  <th>Unattempted</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {result.sectionScores.map((section: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="text-white font-semibold">{section.sectionName}</td>
                    <td className="text-blue-400">{section.attempted}</td>
                    <td className="text-green-400">{section.correct}</td>
                    <td className="text-red-400">{section.incorrect}</td>
                    <td className="text-gray-400">{section.unattempted}</td>
                    <td className="text-white font-bold">{section.score}/{section.totalMarks}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${section.accuracy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-400">{section.accuracy.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Question-wise Analysis */}
        <div className="glass-panel p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📝 Question-wise Analysis</h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {result.questionResults.map((qResult: any, idx: number) => (
              <div 
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  qResult.studentAnswer === null 
                    ? 'bg-gray-500/10 border-gray-500'
                    : qResult.isCorrect 
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-red-500/10 border-red-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-slate-400 text-sm">Q{qResult.questionNum + 1}</span>
                    <span className="text-slate-500 text-sm ml-2">({qResult.section})</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${
                      qResult.marksAwarded > 0 ? 'text-green-400' :
                      qResult.marksAwarded < 0 ? 'text-red-400' :
                      'text-gray-400'
                    }`}>
                      {qResult.marksAwarded > 0 ? '+' : ''}{qResult.marksAwarded}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 text-sm">
                  {qResult.studentAnswer !== null ? (
                    <>
                      <span className="text-slate-400">Your answer: </span>
                      <span className={qResult.isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {Array.isArray(qResult.studentAnswer) 
                          ? qResult.studentAnswer.join(', ') 
                          : qResult.studentAnswer}
                      </span>
                      {!qResult.isCorrect && (
                        <>
                          <span className="text-slate-400 ml-4">Correct: </span>
                          <span className="text-green-400">
                            {Array.isArray(qResult.correctAnswer) 
                              ? qResult.correctAnswer.join(', ') 
                              : qResult.correctAnswer}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">Not attempted</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proctoring Report */}
        {(result.tabSwitchCount > 0 || result.autoSubmitted) && (
          <div className="glass-panel p-6 rounded-2xl mb-6">
            <h2 className="text-xl font-bold text-white mb-4">🔒 Proctoring Report</h2>
            
            <div className="space-y-2 text-slate-300">
              <p>Tab switches detected: <span className="text-yellow-400 font-bold">{result.tabSwitchCount}</span></p>
              <p>Warnings issued: <span className="text-orange-400 font-bold">{result.warningsIssued}</span></p>
              {result.autoSubmitted && (
                <p className="text-red-400 font-bold">⚠️ Exam was auto-submitted due to violations</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <a href="/dashboard" className="btn btn-primary flex-1">
            Back to Dashboard
          </a>
          {result.passed && (
            <button className="btn btn-success flex-1">
              📄 Download Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
