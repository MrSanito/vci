'use client'

import { useState } from 'react';
import { createExam } from '../../actions/examActions';

interface Question {
  questionText: string;
  questionType: 'single' | 'multiple' | 'numerical' | 'caseStudy';
  options: string[];
  correctAnswers: number[];
  marks: number;
}

interface Section {
  id: number;
  title: string;
  questions: Question[];
}

export default function CreateExamForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [sections, setSections] = useState<Section[]>([{ 
        id: 1, 
        title: 'Main Section', 
        questions: [{ questionText: '', questionType: 'single', options: ['', '', '', ''], correctAnswers: [0], marks: 1 }]
    }]);
    const [activeSectionIdx, setActiveSectionIdx] = useState(0);

    const addSection = () => {
        setSections([...sections, { 
            id: Date.now(), 
            title: `Section ${sections.length + 1}`, 
            questions: [{ questionText: '', questionType: 'single', options: ['', '', '', ''], correctAnswers: [0], marks: 1 }]
        }]);
        setActiveSectionIdx(sections.length);
    };

    const removeSection = (id: number) => {
        if (sections.length > 1) {
            setSections(sections.filter(s => s.id !== id));
            setActiveSectionIdx(0);
        }
    };

    const handleAddQuestion = () => {
        const newSections = [...sections];
        newSections[activeSectionIdx].questions.push({
            questionText: '',
            questionType: 'single',
            options: ['', '', '', ''],
            correctAnswers: [0],
            marks: 1
        });
        setSections(newSections);
    };

    const handleQuestionChange = (qIdx: number, field: keyof Question, value: any) => {
        const newSections = [...sections];
        newSections[activeSectionIdx].questions[qIdx] = {
            ...newSections[activeSectionIdx].questions[qIdx],
            [field]: value
        };
        setSections(newSections);
    };

    const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
        const newSections = [...sections];
        newSections[activeSectionIdx].questions[qIdx].options[optIdx] = value;
        setSections(newSections);
    };

    const setCorrectAnswer = (qIdx: number, optIdx: number) => {
        const newSections = [...sections];
        const q = newSections[activeSectionIdx].questions[qIdx];
        
        if (q.questionType === 'single') {
            q.correctAnswers = [optIdx];
        } else {
            if (q.correctAnswers.includes(optIdx)) {
                q.correctAnswers = q.correctAnswers.filter(ans => ans !== optIdx);
            } else {
                q.correctAnswers.push(optIdx);
            }
        }
        setSections(newSections);
    };

    const handleRemoveQuestion = (qIdx: number) => {
        const newSections = [...sections];
        newSections[activeSectionIdx].questions.splice(qIdx, 1);
        setSections(newSections);
    };

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setMessage(null);
        
        // Validate
        let isValid = true;
        sections.forEach(sec => {
            if (!sec.title) isValid = false;
            sec.questions.forEach(q => {
                if (!q.questionText || q.options.some(o => !o) || q.correctAnswers.length === 0) {
                    isValid = false;
                }
            });
        });

        if (!isValid) {
            setMessage({ type: 'error', text: 'Please fill all section titles, question texts, options, and select correct answers.' });
            setLoading(false);
            return;
        }

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const totalDuration = Number(formData.get('duration'));
        
        let totalMarks = 0;
        const sectionsData = sections.map((s) => {
            const secMarks = s.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
            totalMarks += secMarks;
            return {
                name: s.title,
                questionCount: s.questions.length,
                questions: s.questions
            };
        });

        const passingMarks = Math.floor(totalMarks * 0.4); 

        const examPayload = {
            title,
            description,
            totalDuration,
            totalMarks,
            passingMarks,
            sections: sectionsData,
            assignmentType: 'all',
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        };

        const result = await createExam(examPayload);
        
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            const form = document.getElementById('create-exam-form') as HTMLFormElement;
            form.reset();
            setSections([{ 
                id: 1, 
                title: 'Main Section', 
                questions: [{ questionText: '', questionType: 'single', options: ['', '', '', ''], correctAnswers: [0], marks: 1 }]
            }]);
            setActiveSectionIdx(0);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setLoading(false);
    }

    return (
        <div className="w-full">
            {message && (
                <div className={`p-8 rounded-3xl mb-10 text-[11px] font-bold uppercase tracking-[0.2em] italic flex items-center gap-6 border-2 ${message.type === 'success' ? 'bg-[#FF007F10] text-[#FF007F] border-[#FF007F20]' : 'bg-red-500/10 text-red-500 border-red-500/20'} animate-in fade-in slide-in-from-top-4 duration-500`}>
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${message.type === 'success' ? 'bg-[#FF007F] text-white' : 'bg-red-500 text-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={message.type === 'success' ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                   </div>
                    <span>{message.text}</span>
                </div>
            )}

            <form id="create-exam-form" action={handleSubmit} className="space-y-12">
                 {/* Exam Information */}
                 <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[3rem] shadow-xl relative group">
                     <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-8">
                         <div className="w-12 h-12 bg-[#FF007F] text-white rounded-xl flex items-center justify-center shadow-[0_0_20px_#FF007F] rotate-6 italic font-bold text-xl">1</div>
                         <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white font-heading tracking-tight uppercase italic">Exam Details</h3>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1">Enter the basic information for this test</p>
                         </div>
                     </div>

                    <div className="space-y-8 px-2">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 ml-2 italic leading-none block">Exam Title</label>
                            <input name="title" type="text" placeholder="e.g. Final Semester Examination" required 
                                className="w-full h-16 px-8 bg-black border border-white/5 text-white font-bold text-sm rounded-2xl focus:border-[#FF007F] transition-all placeholder:text-zinc-800 italic" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 ml-2 italic leading-none block">Instructions or Description</label>
                            <textarea name="description" placeholder="Enter instructions for students..." required 
                                className="w-full h-28 p-8 bg-black border border-white/5 text-white font-bold text-sm rounded-2xl focus:border-[#FF007F] transition-all placeholder:text-zinc-800 italic resize-none" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 ml-2 italic leading-none block">Duration (Minutes)</label>
                                <input name="duration" type="number" placeholder="60" required 
                                    className="w-full h-16 px-8 bg-black border border-white/5 text-white font-bold text-sm rounded-2xl focus:border-[#FF007F] transition-all italic" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 ml-2 italic leading-none block">Total Marks</label>
                                <div className="w-full h-16 px-8 bg-white/5 border border-white/5 text-zinc-500 font-bold text-sm rounded-2xl italic flex items-center shadow-inner">
                                    {sections.reduce((sum, sec) => sum + sec.questions.reduce((qSum, q) => qSum + (q.marks || 1), 0), 0)} (Auto-calculated)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exam Sections */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                         <div className="flex items-center gap-4">
                            <div className="w-2 h-8 bg-[#FF007F] rounded-full shadow-[0_0_10px_#FF007F]"></div>
                            <h3 className="text-2xl font-bold text-white font-heading tracking-tight uppercase italic leading-none">Question Sections</h3>
                         </div>
                        <button type="button" onClick={addSection} className="px-8 h-12 bg-white/5 border border-dashed border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-[#FF007F] transition-all active:scale-95 italic">
                            + ADD SECTION
                        </button>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-xl relative mt-8">
                        {/* Section Tabs */}
                        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar items-center border-b border-white/5">
                            {sections.map((sec, idx) => (
                                <button 
                                    key={sec.id}
                                    type="button"
                                    onClick={() => setActiveSectionIdx(idx)}
                                    className={`px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest italic transition-all whitespace-nowrap flex items-center gap-3 group/tab ${
                                        activeSectionIdx === idx 
                                        ? 'bg-[#FF007F] text-white shadow-[0_0_20px_-5px_#FF007F]' 
                                        : 'bg-black border border-white/5 text-zinc-500 hover:text-white'
                                    }`}
                                >
                                    <input 
                                        type="text"
                                        value={sec.title}
                                        onChange={(e) => {
                                            const newSections = [...sections];
                                            newSections[idx].title = e.target.value;
                                            setSections(newSections);
                                        }}
                                        className="bg-transparent outline-none w-32 font-bold uppercase font-heading tracking-widest placeholder:text-white/30"
                                        placeholder="Section Title"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    ({sec.questions.length})
                                    {sections.length > 1 && (
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); removeSection(sec.id); }}
                                            className={`w-5 h-5 rounded flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer ${activeSectionIdx === idx ? 'text-white/50 hover:bg-white hover:text-red-500' : 'text-zinc-700'}`}
                                        >
                                            ✕
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {sections[activeSectionIdx] && (
                            <div className="space-y-12 animate-in fade-in duration-500">
                                {sections[activeSectionIdx].questions.map((q, qIdx) => (
                                    <div key={qIdx} className="bg-black border border-white/5 p-8 rounded-4xl relative group border-l-4 border-l-transparent hover:border-l-[#FF007F] transition-all">
                                        <button type="button" onClick={() => handleRemoveQuestion(qIdx)} className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">✕</button>
                                        
                                        <div className="flex items-center gap-6 mb-8 pr-12">
                                            <div className="w-10 h-10 bg-white/5 text-zinc-500 font-bold rounded-xl flex items-center justify-center italic shrink-0">Q{qIdx + 1}</div>
                                            <div className="flex-1">
                                               <input 
                                                  disabled // Form data cannot bind well to deeply nested dynamically rendered nested arrays without custom parsing. We use React state instead. Wait, they don't have name attributes, so ignoring is fine.
                                                  value={q.questionText}
                                                  onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                                                  placeholder="Type your question here..."
                                                  className="w-full bg-transparent text-lg text-white font-bold outline-none placeholder:text-zinc-800 italic focus:text-[#FF007F] transition-colors"
                                               />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-16">
                                            {q.options.map((opt, optIdx) => (
                                                <div key={optIdx} className="flex items-center gap-4">
                                                    <button 
                                                        type="button"
                                                        onClick={() => setCorrectAnswer(qIdx, optIdx)}
                                                        className={`w-6 h-6 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                                                            q.correctAnswers.includes(optIdx)
                                                            ? 'bg-[#FF007F] border-[#FF007F] shadow-[0_0_10px_rgba(255,0,127,0.5)]'
                                                            : 'bg-transparent border-zinc-700 hover:border-zinc-500'
                                                        }`}
                                                    >
                                                        {q.correctAnswers.includes(optIdx) && <span className="w-2 h-2 bg-white rounded-full"></span>}
                                                    </button>
                                                    <input 
                                                        value={opt}
                                                        onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                                        placeholder={`Option ${optIdx + 1}`}
                                                        className={`flex-1 h-12 px-6 bg-[#0A0A0A] border rounded-xl outline-none text-sm transition-all italic font-medium ${
                                                            q.correctAnswers.includes(optIdx) ? 'border-[#FF007F]/50 text-white' : 'border-white/5 text-zinc-400 focus:border-zinc-500'
                                                        }`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="w-full h-20 border-2 border-dashed border-white/10 rounded-[2rem] text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white hover:border-[#FF007F]/50 hover:bg-[#FF007F]/5 transition-all italic flex items-center justify-center gap-4"
                                >
                                    <span className="text-lg leading-none">+</span> Add Question {sections[activeSectionIdx].questions.length + 1}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading} 
                        className="w-full h-20 bg-[#FF007F] text-white text-[11px] font-bold uppercase tracking-[0.4em] rounded-[1.8rem] flex items-center justify-center gap-6 hover:bg-white hover:text-black transition-all duration-500 active:scale-95 disabled:opacity-50 italic shadow-xl">
                    {loading ? (
                         <span className="flex items-center gap-4">
                            <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
                            <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                         </span>
                    ) : (
                        "CREATE EXAM NOW"
                    )}
                </button>
            </form>
        </div>
    );
}
