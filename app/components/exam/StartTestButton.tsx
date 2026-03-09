'use client'

import Link from 'next/link';

export default function StartTestButton({ examId }: { examId: string }) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="checkbox checkbox-primary mt-1" id="agree" />
        <span className="text-slate-300">
          I have read and understood all the instructions. I am ready to begin the test.
        </span>
      </label>

      <Link 
        href={`/exam/${examId}/test`}
        className="btn btn-primary btn-lg w-full"
        onClick={(e) => {
          const checkbox = document.getElementById('agree') as HTMLInputElement;
          if (!checkbox?.checked) {
            e.preventDefault();
            alert('Please accept the instructions to continue');
          }
        }}
      >
        🚀 Start Test
      </Link>
    </div>
  );
}
