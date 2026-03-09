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

  // Get unique batches
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
      setMessage({ type: 'error', text: 'Please select at least one student' });
      return;
    }
    
    if (assignMode === 'batch' && !selectedBatch) {
      setMessage({ type: 'error', text: 'Please select a batch' });
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
    <div className="glass-panel p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Assign Students</h3>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Assignment Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setAssignMode('individual')}
            className={`btn btn-sm ${assignMode === 'individual' ? 'btn-primary' : 'btn-ghost'}`}
          >
            Individual Students
          </button>
          <button
            type="button"
            onClick={() => setAssignMode('batch')}
            className={`btn btn-sm ${assignMode === 'batch' ? 'btn-primary' : 'btn-ghost'}`}
          >
            Batch Assignment
          </button>
        </div>

        {assignMode === 'batch' ? (
          /* Batch Selection */
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">Select Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="select select-bordered w-full bg-slate-800 text-white"
            >
              <option value="">Choose a batch...</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            {batches.length === 0 && (
              <p className="text-sm text-slate-400 mt-2">No batches found. Students need batch assignments.</p>
            )}
          </div>
        ) : (
          /* Individual Student Selection */
          <>
            <div className="mb-4">
              <button 
                type="button"
                onClick={handleSelectAll}
                className="btn btn-sm btn-outline btn-primary mb-2"
              >
                Select All Unassigned
              </button>
              <p className="text-sm text-slate-400">
                {unassignedStudents.length} students available to assign
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
              {unassignedStudents.length === 0 ? (
                <p className="text-slate-400 text-center py-4">All students have been assigned</p>
              ) : (
                unassignedStudents.map((student) => (
                  <label 
                    key={student.clerkId}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.clerkId)}
                      onChange={() => handleToggleStudent(student.clerkId)}
                      className="checkbox checkbox-primary"
                    />
                    <div className="flex-1">
                      <div className="text-white font-semibold">{student.name}</div>
                      <div className="text-sm text-slate-400">
                        {student.rollNumber} • {student.batch || 'No batch'} • {student.email}
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
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : assignMode === 'batch' ? (
            'Assign to Batch'
          ) : (
            `Assign to ${selectedStudents.length} Student(s)`
          )}
        </button>
      </form>
    </div>
  );
}
