import { getStudents } from '../actions/studentActions';
import CreateStudentForm from '../components/admin/CreateStudentForm';
import StudentList from '../components/admin/StudentList';
import CreateSampleExamButton from '../components/admin/CreateSampleExamButton';
import { UserButton } from "@clerk/nextjs";

export default async function AdminDashboard() {
  const students = await getStudents();

  return (
    <div className="min-h-screen pb-24 px-4 sm:px-8 lg:px-14 bg-black text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-8 pt-8 mb-10">
          <div>
            <span className="text-[#FF007F] font-bold uppercase tracking-[0.4em] text-[10px] mb-3 block italic">Admin Panel</span>
            <h1 className="text-4xl sm:text-6xl font-bold text-white font-heading tracking-tighter leading-none uppercase">
              Welcome <span className="text-[#FF007F]">Admin.</span>
            </h1>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-3 italic">Manage all your students and exams from here.</p>
          </div>
          <div className="flex items-center gap-5 p-6 bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-xl shrink-0">
            <div className="flex flex-col items-end gap-1 text-right">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Admin Profile</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">VCI Institute</span>
            </div>
            <div className="h-10 w-px bg-white/5"></div>
            <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-12 h-12 border-2 border-white/10 shadow-xl hover:border-[#FF007F] transition-all' } }} />
          </div>
        </div>

        {/* Quick Actions + Create Student */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Quick Actions */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl hover:border-[#FF007F]/20 transition-all flex-1 shadow-xl">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 bg-[#FF007F] text-white rounded-xl flex items-center justify-center shadow-[0_0_20px_-5px_#FF007F] rotate-12 font-extrabold text-2xl italic shrink-0">V</div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading tracking-tight uppercase leading-none">Quick Actions</h3>
                  <p className="text-[10px] text-[#FF007F] font-bold uppercase tracking-widest mt-1 italic">Exam Portal</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <a href="/admin/exams" className="h-24 bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 rounded-2xl hover:bg-[#FF007F] hover:text-white transition-all hover:scale-105 shadow-lg italic">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  </svg>
                  Exam List
                </a>
                <a href="/admin/exams/new" className="h-24 bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 rounded-2xl hover:bg-white hover:text-black transition-all hover:scale-105 shadow-lg italic">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Exam
                </a>
              </div>
            </div>

            <div className="bg-[#050505] border border-dashed border-white/5 p-8 rounded-3xl hover:border-[#FF007F]/30 transition-all shadow-inner">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-12 h-12 bg-white/5 border border-white/10 text-[#FF007F] rounded-xl flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading tracking-tight uppercase">Setup Tools</h3>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic mt-1">Add sample test data</p>
                </div>
              </div>
              <CreateSampleExamButton />
            </div>
          </div>

          {/* Add New Student */}
          <div className="lg:col-span-8">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-10 rounded-3xl h-full shadow-xl">
              <div className="flex items-center gap-5 mb-8 border-b border-white/5 pb-8">
                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center shadow-xl font-extrabold text-xl shrink-0">E</div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tighter uppercase leading-none">Add New Student</h2>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1 italic">Enroll students into the portal</p>
                </div>
              </div>
              <CreateStudentForm />
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="border-t border-white/5 pt-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-[#FF007F] font-bold uppercase tracking-widest text-[10px] mb-3 block italic">Student Registry</span>
              <h3 className="text-4xl sm:text-5xl font-bold text-white font-heading tracking-tighter uppercase leading-none">Student <span className="text-[#FF007F]">List.</span></h3>
            </div>
            <div className="px-6 py-3 bg-[#0A0A0A] border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-4 whitespace-nowrap">
              <span className="w-2 h-2 bg-[#FF007F] rounded-full shadow-[0_0_10px_#FF007F]"></span>
              {students.length} Students
            </div>
          </div>

          <div className="bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-white/5 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-1.5 h-8 bg-[#FF007F] rounded-full shadow-[0_0_10px_#FF007F]"></div>
                <span className="text-[11px] font-bold text-white uppercase tracking-widest">Active Student Records</span>
              </div>
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-[#FF007F] rounded-full shadow-[0_0_8px_#FF007F]"></div>
                <div className="w-3 h-3 border border-white/10 rounded-full"></div>
              </div>
            </div>
            <div className="p-4 sm:p-8 lg:p-10">
              <StudentList students={students} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}