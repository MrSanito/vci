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

  const specificWord = 'DELETE';

  const handleDelete = async () => {
    if (confirmText !== specificWord) return;
    
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
        className="btn btn-sm btn-outline btn-error"
      >
        🗑️ Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full border border-red-500/30">
            <h3 className="text-2xl font-bold text-red-500 mb-2">Delete Exam</h3>
            <p className="text-white mb-4">
              Are you sure you want to delete <strong className="text-blue-400">"{examTitle}"</strong>?
              This action cannot be undone. All attempts and results associated with this exam will become orphaned.
            </p>
            
            <div className="mb-6">
              <label className="block text-slate-400 text-sm mb-2">
                Type <strong>{specificWord}</strong> to confirm:
              </label>
              <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="input input-bordered w-full bg-slate-900 text-white"
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setConfirmText('');
                }}
                className="btn btn-ghost"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-error"
                disabled={confirmText !== specificWord || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
