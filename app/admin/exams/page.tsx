import { getExams } from "../../actions/examActions";
import Link from "next/link";
import DeleteExamButton from "../../components/admin/DeleteExamButton";

export default async function ExamsPage() {
  const exams = await getExams();

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Exam Management</h1>
          <Link href="/admin/exams/new" className="btn btn-primary">
            + Create New Exam
          </Link>
        </div>

        <div className="grid gap-4">
          {exams.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center">
              <p className="text-slate-400">No exams created yet. Create your first exam!</p>
            </div>
          ) : (
            exams.map((exam: any) => (
              <div key={exam._id} className="glass-panel p-6 rounded-2xl hover:shadow-lg transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{exam.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{exam.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-blue-400">
                        📚 {exam.sections?.length || 0} Sections
                      </span>
                      <span className="text-green-400">
                        ⏱️ {exam.totalDuration} mins
                      </span>
                      <span className="text-purple-400">
                        🎯 {exam.totalMarks} marks
                      </span>
                      <span className="text-yellow-400">
                        👥 {exam.assignedTo?.length || 0} assigned
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <Link 
                      href={`/admin/exams/${exam._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View Details
                    </Link>
                    <Link 
                      href={`/exam/${exam._id}`}
                      className="btn btn-sm btn-outline btn-secondary"
                    >
                      ▶ Play / Preview
                    </Link>
                    <DeleteExamButton examId={exam._id.toString()} examTitle={exam.title} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
