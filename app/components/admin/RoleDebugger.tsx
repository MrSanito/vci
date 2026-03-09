'use client'

import { useState } from 'react';
import { checkCurrentUserRole } from '../../actions/debugActions';

export default function RoleDebugger() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    const data = await checkCurrentUserRole();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl mb-6">
      <h3 className="text-xl font-bold text-white mb-4">🔍 Role Debugger</h3>
      
      <button 
        onClick={handleCheck}
        disabled={loading}
        className="btn btn-primary mb-4"
      >
        {loading ? 'Checking...' : 'Check My Role'}
      </button>

      {result && (
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <pre className="text-xs text-white overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
