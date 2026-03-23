import { currentUser } from "@clerk/nextjs/server";
import CreateExamForm from "../../../components/admin/CreateExamForm";
import { redirect } from "next/navigation";
import { getStudents } from "../../../actions/studentActions";

export default async function NewExamPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  const students = await getStudents();
  const courses = Array.from(new Set(students.map((s: any) => s.course))).filter(Boolean);

  return (
    <div className="min-h-screen pt-10 pb-24 px-4 sm:px-8 lg:px-16 bg-black text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 border-b border-white/5 pb-10">
          <span className="text-[#FF007F] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block italic leading-none">Admin Panel</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-heading tracking-tighter leading-none italic">
            Create <span className="text-[#FF007F]">New Exam.</span>
          </h1>
          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em] italic">Fill in the details below to create a new exam for your students.</p>
        </div>
        <CreateExamForm adminId={user.id} courses={courses} students={students} />
      </div>
    </div>
  );
}
