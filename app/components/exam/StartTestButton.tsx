'use client'

import Link from 'next/link';

interface StartTestButtonProps {
  examId: string;
  isResume?: boolean;
}

export default function StartTestButton({ examId, isResume = false }: StartTestButtonProps) {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {!isResume && (
        <label className="flex items-start gap-4 cursor-pointer group">
          <input 
            type="checkbox" 
            className="w-5 h-5 rounded-lg border-2 border-white/20 bg-white/5 checked:bg-[#FF007F] checked:border-[#FF007F] transition-all cursor-pointer mt-0.5 appearance-none shrink-0" 
            id="agree" 
          />
          <span className="flex-1 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] text-left leading-relaxed group-hover:text-white transition-colors italic">
            I have read all the instructions and I am ready to start the exam.
          </span>
        </label>
      )}

      <Link 
        href={`/exam/${examId}/test`}
        className={`w-full h-18 py-5 flex items-center justify-center font-bold tracking-[0.3em] uppercase text-[11px] rounded-2xl transition-all active:scale-95 italic font-heading shadow-2xl ${
          isResume 
          ? 'bg-[#FF007F] text-white shadow-[0_0_30px_-5px_#FF007F] hover:bg-white hover:text-black' 
          : 'bg-[#FF007F] text-white shadow-[0_0_30px_-5px_#FF007F] hover:bg-white hover:text-black'
        }`}
        onClick={(e) => {
          if (!isResume) {
            const checkbox = document.getElementById('agree') as HTMLInputElement;
            if (!checkbox?.checked) {
              e.preventDefault();
              alert('Please tick the checkbox to confirm you have read the instructions.');
            }
          }
        }}
      >
        {isResume ? '▶ Continue Exam' : '▶ Start Exam Now'}
      </Link>
    </div>
  );
}
