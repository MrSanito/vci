'use client'

import { useState } from 'react';
import { createStudent } from '../../actions/studentActions';

export default function CreateStudentForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setMessage(null);
        
        const result = await createStudent(formData);
        
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            // Reset form
            const form = document.getElementById('create-student-form') as HTMLFormElement;
            form.reset();
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setLoading(false);
    }

    return (
        <div className="glass-panel p-6 rounded-2xl w-full max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-white mb-6">Create New Student</h3>
            
            {message && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <form id="create-student-form" action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                    <input name="name" type="text" placeholder="e.g. Rahul Kumar" required 
                           className="input input-bordered w-full bg-slate-800/50 border-white/10 text-white focus:border-blue-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm text-slate-400 mb-1">Roll Number</label>
                        <input name="rollNumber" type="text" placeholder="VCI2025001" required 
                            className="input input-bordered w-full bg-slate-800/50 border-white/10 text-white focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Course</label>
                        <select name="course" className="select select-bordered w-full bg-slate-800/50 border-white/10 text-white focus:border-blue-500">
                            <option>ADCA</option>
                            <option>CCC & O-Level</option>
                            <option>Tally Prime</option>
                            <option>Web Design</option>
                            <option>Basics</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Email</label>
                    <input name="email" type="email" placeholder="student@example.com" required 
                           className="input input-bordered w-full bg-slate-800/50 border-white/10 text-white focus:border-blue-500" />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">Password</label>
                    <input name="password" type="password" placeholder="Min. 8 characters" required minLength={8}
                           className="input input-bordered w-full bg-slate-800/50 border-white/10 text-white focus:border-blue-500" />
                </div>

                <button type="submit" disabled={loading} 
                        className="btn bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none w-full shadow-lg hover:shadow-blue-500/20">
                    {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Create Student Account'}
                </button>
            </form>
        </div>
    );
}
