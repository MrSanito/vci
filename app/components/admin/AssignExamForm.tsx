'use client'

import { useState } from 'react';
import { assignExamToStudents, assignExamToBatch } from '@/app/actions/examAssignmentActions';

interface AssignExamFormProps {
  examId: string;
  students: any[];
  currentlyAssigned: string[];
}

export default function AssignExamForm({ examId, students, currentlyAssigned }: AssignExamFormProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [assignMode, setAssignMode] = useState<'individual' | 'batch'>('individual');
  const [selectedBatch, setSelectedBatch] = useState('');

  const batches = Array.from(new Set(students.map(s => s.batch).filter(Boolean)));

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const unassignedIds = students
      .filter(s => !currentlyAssigned.includes(s.clerkId))
      .map(s => s.clerkId);
    setSelectedStudents(unassignedIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (assignMode === 'individual' && selectedStudents.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one student.' });
      return;
    }
    
    if (assignMode === 'batch' && !selectedBatch) {
      setMessage({ type: 'error', text: 'Please select a batch/course.' });
      return;
    }

    setLoading(true);
    
    const result = assignMode === 'batch'
      ? await assignExamToBatch(examId, selectedBatch)
      : await assignExamToStudents(examId, selectedStudents);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setSelectedStudents([]);
      setSelectedBatch('');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  };

  const unassignedStudents = students.filter(s => !currentlyAssigned.includes(s.clerkId));

  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-xl text-white">
      <h3 className="text-xl font-bold text-white mb-10 font-heading italic uppercase border-b border-white/5 pb-6">Assign Exam to Students</h3>
      
      {message && (
        <div className={`p-6 rounded-2xl mb-8 text-[10px] font-bold uppercase tracking-widest italic flex items-center gap-5 border ${message.type === 'success' ? 'bg-[#FF007F10] text-[#FF007F] border-[#FF007F20]' : 'bg-red-500/10 text-red-400 border-red-500/20'} animate-in fade-in duration-300`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-[#FF007F] text-white' : 'bg-red-500 text-white'}`}>
            {message.type === 'success' ? '✓' : '!'}
          </div>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Mode Toggle */}
        <div className="flex gap-3 mb-8">
          {[
            { val: 'individual', label: 'Select Students' },
            { val: 'batch', label: 'By Course/Batch' }
          ].map(opt => (
            <button
              key={opt.val}
              type="button"
              onClick={() => setAssignMode(opt.val as any)}
              className={`h-12 px-8 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all italic ${assignMode === opt.val ? 'bg-[#FF007F] text-white shadow-[0_0_15px_-5px_#FF007F]' : 'bg-white/5 border border-white/10 text-zinc-500 hover:text-white'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {assignMode === 'batch' ? (
          <div className="mb-8">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 block italic">Choose a Course/Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full h-14 px-6 bg-black border border-white/10 text-white rounded-2xl focus:border-[#FF007F] outline-none font-bold italic"
            >
              <option value="">Select a course...</option>
              {batches.map((batch: any) => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            {batches.length === 0 && (
              <p className="text-[10px] text-zinc-600 mt-3 italic font-bold uppercase tracking-widest">No courses found. Students need course assignments first.</p>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic">{unassignedStudents.length} students available</p>
              <button 
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] font-bold uppercase tracking-widest text-[#FF007F] hover:text-white transition-colors italic underline underline-offset-4"
              >
                Select All
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-3 mb-8 custom-scrollbar pr-2">
              {unassignedStudents.length === 0 ? (
                <p className="text-zinc-600 text-center py-8 text-[10px] font-bold uppercase tracking-widest italic">All students have already been assigned this exam.</p>
              ) : (
                unassignedStudents.map((student) => (
                  <label 
                    key={student.clerkId}
                    className="flex items-center gap-4 p-5 bg-black border border-white/5 rounded-2xl cursor-pointer hover:border-[#FF007F]/30 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.clerkId)}
                      onChange={() => handleToggleStudent(student.clerkId)}
                      className="w-5 h-5 accent-[#FF007F] rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold italic truncate">{student.name}</div>
                      <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic mt-0.5">
                        {student.rollNumber} • {student.course || 'No course'}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </>
        )}

        <button 
          type="submit" 
          disabled={loading || (assignMode === 'individual' && selectedStudents.length === 0) || (assignMode === 'batch' && !selectedBatch)}
          className="w-full h-16 bg-[#FF007F] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white hover:text-black transition-all active:scale-95 disabled:opacity-40 italic shadow-[0_0_20px_-5px_#FF007F] flex items-center justify-center gap-4"
        >
          {loading ? (
            <span className="flex gap-3">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
            </span>
          ) : assignMode === 'batch' ? (
            'Assign to Entire Course'
          ) : (
            `Assign to ${selectedStudents.length} Student(s)`
          )}
        </button>
      </form>
    </div>
  );
}
