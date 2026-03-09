import { getStudents } from '../actions/studentActions';
import CreateStudentForm from '../components/admin/CreateStudentForm';
import StudentList from '../components/admin/StudentList';
import CreateSampleExamButton from '../components/admin/CreateSampleExamButton';
import { UserButton } from "@clerk/nextjs";

export default async function AdminDashboard() {
  const students = await getStudents();

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-slate-400 mt-2">Manage students and institute settings</p>
                </div>
                {/* Ensure UserButton is visible even if Navbar is different */}
                <div className="glass-panel p-2 rounded-full px-4 flex items-center gap-3">
                   <span className="text-sm font-semibold text-blue-400">Admin</span>
                   <UserButton />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Create Form */}
                <div className="lg:col-span-1">
                    <CreateStudentForm />
                </div>

                {/* Right Column: List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Sample Exam Creator */}
                    <CreateSampleExamButton />
                    
                    {/* Quick Actions */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <a href="/admin/exams" className="btn btn-primary">
                                📝 Manage Exams
                            </a>
                            <a href="/admin/exams/new" className="btn btn-outline btn-primary">
                                ➕ Create New Exam
                            </a>
                            <a href="/dashboard" className="btn btn-outline btn-secondary">
                                👁️ Preview Student Dashboard
                            </a>
                        </div>
                    </div>

                    {/* Student List */}
                    <StudentList students={students} />
                </div>
            </div>
        </div>
    </div>
  );
}