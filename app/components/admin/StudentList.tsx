'use client'

interface Student {
    _id: string;
    name: string;
    rollNumber: string;
    course: string;
    email: string;
    createdAt: string;
}

export default function StudentList({ students }: { students: Student[] }) {
    return (
        <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Enrolled Students ({students.length})</h3>
            
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="text-slate-400 border-white/10">
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-slate-500">
                                    No students enrolled yet.
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student._id} className="border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="font-mono text-blue-400">{student.rollNumber}</td>
                                    <td className="font-bold text-white">{student.name}</td>
                                    <td>
                                        <span className="badge badge-ghost bg-purple-500/10 text-purple-300 border-none">
                                            {student.course}
                                        </span>
                                    </td>
                                    <td className="text-slate-400">{student.email}</td>
                                    <td className="text-slate-500 text-sm">
                                        {new Date(student.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button className="btn btn-xs btn-ghost text-red-400 hover:bg-red-500/10">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
