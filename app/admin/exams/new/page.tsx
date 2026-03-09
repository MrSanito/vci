import { currentUser } from "@clerk/nextjs/server";
import CreateExamForm from "../../../components/admin/CreateExamForm";
import { redirect } from "next/navigation";
import { getStudents } from "../../../actions/studentActions";

export default async function NewExamPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  const students = await getStudents();
  // Extract unique courses from students
  const courses = Array.from(new Set(students.map((s: any) => s.course))).filter(Boolean);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <CreateExamForm adminId={user.id} courses={courses} students={students} />
    </div>
  );
}
