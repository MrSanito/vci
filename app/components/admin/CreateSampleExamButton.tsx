'use client'

import { useState } from 'react';
import { createSampleExam } from '../../actions/sampleExamAction';

export default function CreateSampleExamButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleCreate() {
    setLoading(true);
    setMessage(null);
    
    const result = await createSampleExam();
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      // Refresh the page after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  }

  return (
    <div className="glass-panel p-6 rounded-2xl mb-6">
      <h3 className="text-lg font-bold text-white mb-3">Quick Setup</h3>
      <p className="text-slate-400 text-sm mb-4">
        Create a sample exam with 50 computer hardware questions for testing
      </p>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message.text}
        </div>
      )}
      
      <button 
        onClick={handleCreate}
        disabled={loading}
        className="btn bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none"
      >
        {loading ? <span className="loading loading-spinner loading-sm"></span> : '🚀 Create Sample Exam'}
      </button>
    </div>
  );
}
