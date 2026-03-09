import { getExamAnalytics } from "../../../actions/examAnalyticsActions";
import { getStudents } from "../../../actions/studentActions";
import { redirect } from "next/navigation";
import AssignExamForm from "../../../components/admin/AssignExamForm";

export default async function ExamDetailsPage({ params }: { params: { id: string } }) {
  const analytics = await getExamAnalytics(params.id);
  
  if (!analytics || !analytics.exam) {
    redirect('/admin/exams');
  }

  const students = await getStudents();
  const studentMap = new Map(students.map((s: any) => [s.clerkId, s]));

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{analytics.exam.title}</h1>
          <p className="text-slate-400">{analytics.exam.description}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-3xl font-bold text-blue-400 mb-2">{analytics.assignedCount}</div>
            <div className="text-sm text-slate-400">Total Assigned</div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-3xl font-bold text-green-400 mb-2">{analytics.completedCount}</div>
            <div className="text-sm text-slate-400">Completed ({((analytics.completedCount / analytics.assignedCount) * 100).toFixed(0)}%)</div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{analytics.inProgressCount}</div>
            <div className="text-sm text-slate-400">In Progress</div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-3xl font-bold text-gray-400 mb-2">{analytics.notStartedCount}</div>
            <div className="text-sm text-slate-400">Not Started</div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {analytics.avgScore.toFixed(2)} / {analytics.exam.totalMarks}
            </div>
            <div className="text-sm text-slate-400">Average Score</div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-2xl font-bold text-green-400 mb-2">{analytics.passCount}</div>
            <div className="text-sm text-slate-400">Passed</div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-2xl font-bold text-red-400 mb-2">{analytics.failCount}</div>
            <div className="text-sm text-slate-400">Failed</div>
          </div>
        </div>

        {/* Student-wise Status */}
        <div className="glass-panel p-6 rounded-2xl mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Student-wise Attempt Status</h2>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-slate-400">
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Time Taken</th>
                  <th>Tab Switches</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analytics.exam.assignedTo.map((studentId: string) => {
                  const student = studentMap.get(studentId);
                  const result = analytics.results.find((r: any) => r.studentId === studentId);
                  const attempt = analytics.attempts.find((a: any) => a.studentId === studentId);
                  
                  return (
                    <tr key={studentId} className="hover:bg-slate-800/50">
                      <td className="text-white">{student?.name || 'Unknown'}</td>
                      <td className="text-slate-400">{student?.rollNumber || '-'}</td>
                      <td>
                        {result ? (
                          <span className="badge badge-success">✅ Completed</span>
                        ) : attempt && !attempt.submitted ? (
                          <span className="badge badge-warning">🔄 In Progress</span>
                        ) : (
                          <span className="badge badge-ghost">⏳ Not Started</span>
                        )}
                      </td>
                      <td className="text-white font-bold">
                        {result ? `${result.totalScore}/${result.totalMarks}` : '-'}
                      </td>
                      <td className="text-slate-400">
                        {result ? `${Math.floor(result.totalTimeTaken / 60)}m` : '-'}
                      </td>
                      <td className="text-yellow-400">
                        {result ? result.tabSwitchCount : attempt?.tabSwitchCount || 0}
                      </td>
                      <td>
                        {result && (
                          <a 
                            href={`/results/${result._id}`}
                            className="btn btn-xs btn-primary"
                          >
                            View Result
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

        {/* Assign Students */}
        <div className="mb-8">
          <AssignExamForm 
            examId={params.id} 
            students={students}
            currentlyAssigned={analytics.exam.assignedTo || []}
          />
        </div>

        {/* Top Performers */}
        {analytics.results.length > 0 && (
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">🏆 Top Performers</h2>
            
            <div className="space-y-3">
              {analytics.results.slice(0, 5).map((result: any, idx: number) => {
                const student = studentMap.get(result.studentId);
                return (
                  <div key={result._id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
                    <div className={`text-2xl font-bold ${
                      idx === 0 ? 'text-yellow-400' :
                      idx === 1 ? 'text-gray-300' :
                      idx === 2 ? 'text-orange-400' :
                      'text-slate-400'
                    }`}>
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{student?.name || 'Unknown'}</div>
                      <div className="text-sm text-slate-400">{student?.rollNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">{result.totalScore}/{result.totalMarks}</div>
                      <div className="text-sm text-slate-400">{result.percentage.toFixed(2)}%</div>
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
