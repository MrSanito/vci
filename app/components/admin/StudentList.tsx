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
    if (students.length === 0) {
        return (
            <div className="text-center py-20 text-[11px] font-bold uppercase tracking-widest text-zinc-700 border border-dashed border-white/5 rounded-2xl italic animate-pulse">
                No students found. Add your first student above.
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table (md+) */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full border-separate border-spacing-y-4 min-w-[700px]">
                    <thead>
                        <tr className="italic">
                            <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-600">Roll No.</th>
                            <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-600">Name</th>
                            <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-600">Course</th>
                            <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-600">Email</th>
                            <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-600">Joined</th>
                            <th className="px-6 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-600">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id} className="group bg-black hover:bg-[#0A0A0A] transition-all">
                                <td className="px-6 py-5 rounded-l-2xl border-y border-l border-white/5 group-hover:border-[#FF007F]/20">
                                    <span className="font-bold text-[11px] text-[#FF007F] bg-[#FF007F10] px-4 py-1.5 rounded-xl border border-[#FF007F30] italic">
                                        {student.rollNumber}
                                    </span>
                                </td>
                                <td className="px-6 py-5 border-y border-white/5 group-hover:border-[#FF007F]/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 text-white flex items-center justify-center font-bold text-sm italic group-hover:bg-[#FF007F] group-hover:border-[#FF007F] transition-all">
                                            {student.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-white text-sm italic group-hover:text-[#FF007F] transition-colors">{student.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 border-y border-white/5 group-hover:border-[#FF007F]/20">
                                    <span className="px-4 py-2 rounded-xl bg-white/5 text-zinc-500 text-[9px] font-bold uppercase tracking-widest border border-white/10 group-hover:bg-white group-hover:text-black transition-all italic">
                                        {student.course}
                                    </span>
                                </td>
                                <td className="px-6 py-5 border-y border-white/5 group-hover:border-[#FF007F]/20">
                                    <span className="text-zinc-600 font-bold text-[10px] italic group-hover:text-white transition-colors truncate max-w-[180px] block">
                                        {student.email}
                                    </span>
                                </td>
                                <td className="px-6 py-5 border-y border-white/5 group-hover:border-[#FF007F]/20">
                                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest italic">
                                        {new Date(student.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </td>
                                <td className="px-6 py-5 rounded-r-2xl border-y border-r border-white/5 text-right group-hover:border-[#FF007F]/20">
                                    <button className="w-10 h-10 bg-white/5 text-zinc-700 hover:bg-red-600 hover:text-white rounded-xl border border-white/10 group-hover:border-red-600/30 transition-all active:scale-90 flex items-center justify-center ml-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards (< md) */}
            <div className="flex flex-col gap-4 md:hidden">
                {students.map((student) => (
                    <div key={student._id} className="bg-black border border-white/5 rounded-2xl p-5 hover:border-[#FF007F]/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#FF007F] text-white flex items-center justify-center font-bold text-sm italic">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm italic">{student.name}</p>
                                    <span className="text-[9px] font-bold text-[#FF007F] bg-[#FF007F10] px-3 py-1 rounded-lg border border-[#FF007F30] italic">
                                        {student.rollNumber}
                                    </span>
                                </div>
                            </div>
                            <button className="w-9 h-9 bg-white/5 text-zinc-700 hover:bg-red-600 hover:text-white rounded-xl border border-white/10 transition-all active:scale-90 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-2 border-t border-white/5 pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic">Course</span>
                                <span className="text-[10px] font-bold text-zinc-400 italic uppercase">{student.course}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic">Email</span>
                                <span className="text-[10px] font-bold text-zinc-500 truncate max-w-[180px] italic">{student.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest italic">Joined</span>
                                <span className="text-[10px] font-bold text-zinc-500 italic">
                                    {new Date(student.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
