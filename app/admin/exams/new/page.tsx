import { currentUser } from "@clerk/nextjs/server";
import CreateExamForm from "../../../components/admin/CreateExamForm";
import { redirect } from "next/navigation";

export default async function NewExamPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <CreateExamForm adminId={user.id} />
    </div>
  );
}
