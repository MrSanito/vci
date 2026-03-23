'use client'

import { useState } from 'react';
import { updateExamQuestions } from '@/app/actions/examActions';

interface Question {
  questionText: string;
  questionType: 'single' | 'multiple' | 'numerical' | 'caseStudy';
  options: string[];
  correctAnswers: number[];
  marks: number;
}

interface Section {
  _id?: string;
  name: string;
  questionCount: number;
  questions: Question[];
}

interface AdminQuestionEditorProps {
  examId: string;
  initialSections: Section[];
}

export default function AdminQuestionEditor({ examId, initialSections }: AdminQuestionEditorProps) {
  const [sections, setSections] = useState<Section[]>(initialSections || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

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

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    
    // Verify question counts match
    let isValid = true;
    sections.forEach(sec => {
        if (sec.questions.length !== sec.questionCount) {
            isValid = false;
            setMessage({ type: 'error', text: `Section "${sec.name}" expects ${sec.questionCount} questions but has ${sec.questions.length}.` });
        }
        sec.questions.forEach(q => {
            if (!q.questionText || q.options.some(o => !o) || q.correctAnswers.length === 0) {
                isValid = false;
                setMessage({ type: 'error', text: 'Please fill all question text, options, and select correct answers.' });
            }
        });
    });

    if (!isValid) {
        setLoading(false);
        return;
    }

    const payload = sections.map(sec => ({
        name: sec.name,
        questionCount: sec.questionCount,
        questions: sec.questions
    }));

    const result = await updateExamQuestions(examId, payload);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Questions saved successfully!' });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  };

  if (!sections || sections.length === 0) {
      return null;
  }

  const activeSection = sections[activeSectionIdx];

  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-xl text-white">
      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
          <h3 className="text-xl font-bold text-white font-heading italic uppercase">Exam Questions</h3>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF007F] animate-pulse"></span>
              Draft Mode
          </span>
      </div>
      
      {message && (
        <div className={`p-6 rounded-2xl mb-8 text-[10px] font-bold uppercase tracking-widest italic flex items-center gap-5 border ${message.type === 'success' ? 'bg-[#FF007F10] text-[#FF007F] border-[#FF007F20]' : 'bg-red-500/10 text-red-500 border-red-500/20'} animate-in fade-in duration-300`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-[#FF007F]' : 'bg-red-500'} text-white`}>
            {message.type === 'success' ? '✓' : '!'}
          </div>
          {message.text}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
          {sections.map((sec, idx) => (
              <button 
                  key={idx}
                  onClick={() => setActiveSectionIdx(idx)}
                  className={`px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest italic transition-all whitespace-nowrap ${
                      activeSectionIdx === idx 
                      ? 'bg-[#FF007F] text-white shadow-[0_0_20px_-5px_#FF007F]' 
                      : 'bg-black border border-white/5 text-zinc-500 hover:text-white'
                  }`}
              >
                  {sec.name} ({sec.questions.length}/{sec.questionCount})
              </button>
          ))}
      </div>

      <div className="space-y-12">
          {activeSection.questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-black border border-white/5 p-8 rounded-4xl relative group border-l-4 border-l-transparent hover:border-l-[#FF007F] transition-all">
                  <button onClick={() => handleRemoveQuestion(qIdx)} className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">✕</button>
                  
                  <div className="flex items-center gap-6 mb-8">
                      <div className="w-10 h-10 bg-white/5 text-zinc-500 font-bold rounded-xl flex items-center justify-center italic">Q{qIdx + 1}</div>
                      <div className="flex-1">
                         <input 
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

          {activeSection.questions.length < activeSection.questionCount && (
              <button 
                  onClick={handleAddQuestion}
                  className="w-full h-20 border-2 border-dashed border-white/10 rounded-4xl text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white hover:border-[#FF007F]/50 hover:bg-[#FF007F]/5 transition-all italic flex items-center justify-center gap-4"
              >
                  <span className="text-lg leading-none">+</span> Add Question {activeSection.questions.length + 1}
              </button>
          )}
      </div>

      <div className="mt-12 flex justify-end pt-8 border-t border-white/5">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="px-12 h-16 bg-[#FF007F] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white hover:text-black transition-all active:scale-95 disabled:opacity-40 italic shadow-[0_0_20px_-5px_#FF007F] flex items-center justify-center gap-4"
        >
          {loading ? 'Saving...' : 'Save All Questions'}
        </button>
      </div>
    </div>
  );
}
