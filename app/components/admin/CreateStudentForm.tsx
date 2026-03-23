'use client'

import { useState } from 'react';
import { createStudent } from '../../actions/studentActions';

export default function CreateStudentForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string, studentId?: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const result = await createStudent(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message, studentId: result.studentId });
      (document.getElementById('create-student-form') as HTMLFormElement).reset();
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  }

  return (
    <div className="w-full">
      {message && (
        <div className={`p-6 sm:p-8 rounded-3xl mb-10 border-2 ${message.type === 'success' ? 'bg-[#FF007F10] border-[#FF007F20]' : 'bg-red-500/10 border-red-500/20'} animate-in fade-in slide-in-from-top-2 duration-500`}>
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${message.type === 'success' ? 'bg-[#FF007F] text-white' : 'bg-red-500 text-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={message.type === 'success' ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-[0.2em] italic ${message.type === 'success' ? 'text-[#FF007F]' : 'text-red-500'}`}>{message.text}</span>
               </div>
               
               {message.type === 'success' && message.studentId && (
                   <a href={`/admin/exams`} className="shrink-0 px-6 py-3 bg-[#FF007F] text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all shadow-xl italic whitespace-nowrap">
                       Assign Exam Now →
                   </a>
               )}
           </div>
        </div>
      )}

      <form id="create-student-form" action={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-2">
          {/* Student Info */}
          <div className="space-y-3">
             <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 ml-2 italic leading-none block">Full Name</label>
             <input name="name" type="text" placeholder="e.g. Rahul Kumar" required 
                className="w-full h-16 px-8 bg-black border border-white/5 text-white font-bold text-sm rounded-2xl focus:border-[#FF007F] transition-all placeholder:text-zinc-800 italic" />
          </div>
          <div className="space-y-3">
             <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 ml-2 italic leading-none block">Email Address</label>
             <input name="email" type="email" placeholder="rahul@example.com" required 
                className="w-full h-16 px-8 bg-black border border-white/5 text-white font-bold text-sm rounded-2xl focus:border-[#FF007F] transition-all placeholder:text-zinc-800 italic" />
          </div>
          <div className="space-y-3">
             <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 ml-2 italic leading-none block">Course Name</label>
             <select name="course" required defaultValue=""
                className="w-full h-16 px-8 bg-black border border-white/5 text-white font-bold text-sm rounded-2xl focus:border-[#FF007F] transition-all italic appearance-none cursor-pointer">
                <option value="" disabled className="text-zinc-600">Select a course...</option>
                <option value="Basic Computer Course">Basic Computer Course (BCC)</option>
                <option value="Advanced Excel">Advanced Excel</option>
                <option value="Tally ERP 9">Tally ERP 9</option>
                <option value="Web Development">Web Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Python Programming">Python Programming</option>
             </select>
          </div>
          <div className="space-y-3">
             <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 ml-2 italic leading-none block flex items-center gap-2">
                 Roll Number
                 <span className="px-2 py-0.5 bg-[#FF007F]/20 text-[#FF007F] rounded text-[8px] normal-case tracking-normal">Auto-generated</span>
             </label>
             <input type="text" disabled placeholder="Will be generated automatically" 
                className="w-full h-16 px-8 bg-white/5 border border-white/5 text-zinc-500 font-bold text-sm rounded-2xl italic cursor-not-allowed" />
          </div>
        </div>

        <button type="submit" disabled={loading} 
                className={`w-full h-20 bg-[#FF007F] text-white text-[11px] font-bold uppercase tracking-[0.4em] rounded-[1.8rem] flex items-center justify-center gap-6 hover:bg-white hover:text-black transition-all duration-500 active:scale-95 disabled:opacity-50 italic shadow-xl`}>
             {loading ? (
                 <span className="flex items-center gap-4">
                    <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
                    <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                 </span>
             ) : (
                "ADD STUDENT NOW"
             )}
        </button>
      </form>
    </div>
  );
}
