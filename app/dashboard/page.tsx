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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Student Profile Not Found</h2>
          <p className="text-slate-300 mb-6">Please contact your administrator to set up your student account.</p>
          <Link href="/login" className="btn bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const { student, attempts, results, stats, isAdmin } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass-panel border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{student.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VCI Student Portal</h1>
              <p className="text-sm text-slate-400">Welcome back, {student.name.split(' ')[0]}!</p>
            </div>
          </div>
          <UserButton afterSignOutUrl="/login" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Admin Notice */}
        {isAdmin && (
          <div className="mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👨‍💼</span>
              <div>
                <p className="text-amber-300 font-semibold">Admin Preview Mode</p>
                <p className="text-sm text-slate-300">You're viewing the dashboard as an administrator. This is how students see their portal.</p>
              </div>
            </div>
            <Link href="/admin" className="btn btn-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
              Back to Admin Panel
            </Link>
          </div>
        )}
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-2xl mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{student.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📧</span>
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">🎓</span>
                  <span>{student.course}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">🆔</span>
                  <span>{student.rollNumber}</span>
                </div>
                {student.batch && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">📅</span>
                    <span>Batch: {student.batch}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="badge badge-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
              {student.role}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalExams}</div>
              <div className="text-sm text-slate-400">Total Exams</div>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="text-3xl font-bold text-green-400 mb-1">{stats.completedExams}</div>
              <div className="text-sm text-slate-400">Completed</div>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.inProgressExams}</div>
              <div className="text-sm text-slate-400">In Progress</div>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.pendingExams}</div>
              <div className="text-sm text-slate-400">Pending</div>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400 mb-1">{stats.averageScore}%</div>
              <div className="text-sm text-slate-400">Avg Score</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assigned Exams */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📝</span> Assigned Exams
            </h3>
            
            {attempts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <div className="text-5xl mb-3">📚</div>
                <p>No exams assigned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.map((attempt: any) => (
                  <div key={attempt._id} className="bg-slate-800/50 rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{attempt.examId.title}</h4>
                      <span className={`badge badge-sm ${
                        attempt.status === 'completed' ? 'badge-success' :
                        attempt.status === 'in-progress' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {attempt.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{attempt.examId.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex gap-4">
                        <span>⏱️ {attempt.examId.duration} min</span>
                        <span>📊 {attempt.examId.totalMarks} marks</span>
                      </div>
                      {attempt.status === 'pending' && (
                        <Link 
                          href={`/exam/${attempt._id}`}
                          className="btn btn-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none"
                        >
                          Start Exam
                        </Link>
                      )}
                      {attempt.status === 'in-progress' && (
                        <Link 
                          href={`/exam/${attempt._id}`}
                          className="btn btn-xs bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-none"
                        >
                          Continue
                        </Link>
                      )}
                      {attempt.status === 'completed' && (
                        <Link 
                          href={`/results/${attempt._id}`}
                          className="btn btn-xs bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none"
                        >
                          View Result
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🏆</span> Recent Results
            </h3>
            
            {results.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <div className="text-5xl mb-3">📊</div>
                <p>No results yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.slice(0, 5).map((result: any) => (
                  <div key={result._id} className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{result.examId.title}</h4>
                      <span className={`badge ${result.passed ? 'badge-success' : 'badge-error'}`}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm">
                        <span className="text-slate-300">
                          Score: <span className="font-bold text-white">{result.score}/{result.examId.totalMarks}</span>
                        </span>
                        <span className="text-slate-300">
                          <span className={`font-bold ${result.percentage >= 70 ? 'text-green-400' : result.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {result.percentage}%
                          </span>
                        </span>
                      </div>
                      <Link 
                        href={`/results/${result.attemptId}`}
                        className="btn btn-xs btn-ghost text-blue-400"
                      >
                        Details →
                      </Link>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      ⏱️ Completed in {result.timeTaken} minutes
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
