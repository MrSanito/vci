'use client'

import { useState } from 'react';
import { deleteExam } from '@/app/actions/examActions';
import { useRouter } from 'next/navigation';

interface DeleteExamButtonProps {
  examId: string;
  examTitle: string;
}

export default function DeleteExamButton({ examId, examTitle }: DeleteExamButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    
    setIsDeleting(true);
    const result = await deleteExam(examId);
    
    if (result.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      alert(result.message);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="h-12 px-6 bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all italic flex items-center gap-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0A0A0A] border border-red-600/30 p-10 rounded-[3rem] max-w-md w-full shadow-2xl shadow-red-900/20">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl rotate-3 italic shrink-0">!</div>
              <div>
                <h3 className="text-2xl font-bold text-white font-heading italic uppercase leading-none">Delete Exam?</h3>
                <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1 italic">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-zinc-400 mb-8 font-bold text-[10px] uppercase tracking-widest italic leading-loose">
              You are about to permanently delete <span className="text-white">"{examTitle}"</span>. All student results linked to this exam will be lost.
            </p>
            
            <div className="mb-8">
              <label className="block text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-3 italic">
                Type <span className="text-red-400">DELETE</span> to confirm:
              </label>
              <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full h-14 px-6 bg-black border border-white/10 text-white rounded-2xl focus:border-red-600 outline-none font-bold italic placeholder:text-zinc-800"
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setIsOpen(false); setConfirmText(''); }}
                className="flex-1 h-14 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all italic"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 h-14 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all active:scale-95 disabled:opacity-40 italic"
                disabled={confirmText !== 'DELETE' || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
