'use client'

import { useState } from 'react';
import { createExam } from '../../actions/examActions';
import { useRouter } from 'next/navigation';

interface Question {
  questionText: string;
  questionType: 'single' | 'multiple' | 'numerical';
  options: string[];
  correctAnswers: number[];
  marks: number;
  negativeMarks: number;
}

interface Section {
  name: string;
  questions: Question[];
}

export default function CreateExamForm({ adminId }: { adminId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Basic exam details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalDuration, setTotalDuration] = useState(180); // minutes
  const [passingMarks, setPassingMarks] = useState(40);
  const [instructions, setInstructions] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Sections
  const [sections, setSections] = useState<Section[]>([
    { name: 'Section 1', questions: [] }
  ]);
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const addSection = () => {
    setSections([...sections, { name: `Section ${sections.length + 1}`, questions: [] }]);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      questionType: 'single',
      options: ['', '', '', ''],
      correctAnswers: [],
      marks: 4,
      negativeMarks: 1
    };
    
    const updated = [...sections];
    updated[currentSectionIndex].questions.push(newQuestion);
    setSections(updated);
  };

  const updateQuestion = (qIndex: number, field: string, value: any) => {
    const updated = [...sections];
    updated[currentSectionIndex].questions[qIndex] = {
      ...updated[currentSectionIndex].questions[qIndex],
      [field]: value
    };
    setSections(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...sections];
    updated[currentSectionIndex].questions[qIndex].options[optIndex] = value;
    setSections(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Calculate total marks
    const totalMarks = sections.reduce((sum, section) => 
      sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0), 0
    );

    const examData = {
      title,
      description,
      totalDuration,
      sections,
      totalMarks,
      passingMarks,
      assignedTo: [],
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      instructions,
      shuffleQuestions: false,
      shuffleOptions: false,
      showResultsImmediately: true,
      adminId
    };

    const result = await createExam(examData);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => router.push('/admin/exams'), 1500);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Exam</h2>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Basic Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Exam Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input input-bordered w-full bg-slate-800/50 border-white/10 text-white"
                placeholder="e.g., JEE Main Mock Test 1"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Duration (minutes)</label>
              <input 
                type="number" 
                value={totalDuration}
                onChange={(e) => setTotalDuration(Number(e.target.value))}
                required
                className="input input-bordered w-full bg-slate-800/50 border-white/10 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Start Date</label>
              <input 
                type="datetime-local" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="input input-bordered w-full bg-slate-800/50 border-white/10 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">End Date</label>
              <input 
                type="datetime-local" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="input input-bordered w-full bg-slate-800/50 border-white/10 text-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full bg-slate-800/50 border-white/10 text-white"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Sections & Questions</h3>
            <button type="button" onClick={addSection} className="btn btn-sm btn-primary">
              + Add Section
            </button>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {sections.map((section, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSectionIndex(idx)}
                className={`btn btn-sm ${currentSectionIndex === idx ? 'btn-primary' : 'btn-ghost'}`}
              >
                {section.name} ({section.questions.length})
              </button>
            ))}
          </div>

          {/* Current Section */}
          <div className="space-y-4">
            <input 
              type="text"
              value={sections[currentSectionIndex].name}
              onChange={(e) => {
                const updated = [...sections];
                updated[currentSectionIndex].name = e.target.value;
                setSections(updated);
              }}
              className="input input-bordered w-full bg-slate-800/50 border-white/10 text-white"
              placeholder="Section Name"
            />

            {/* Questions */}
            {sections[currentSectionIndex].questions.map((q, qIdx) => (
              <div key={qIdx} className="border border-white/10 rounded-lg p-4 bg-slate-800/30">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-blue-400 font-semibold">Question {qIdx + 1}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      const updated = [...sections];
                      updated[currentSectionIndex].questions.splice(qIdx, 1);
                      setSections(updated);
                    }}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </div>

                <textarea
                  value={q.questionText}
                  onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                  placeholder="Enter question text"
                  className="textarea textarea-bordered w-full bg-slate-700/50 text-white mb-3"
                  rows={2}
                />

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <select
                    value={q.questionType}
                    onChange={(e) => updateQuestion(qIdx, 'questionType', e.target.value)}
                    className="select select-bordered bg-slate-700/50 text-white"
                  >
                    <option value="single">Single Correct</option>
                    <option value="multiple">Multiple Correct</option>
                    <option value="numerical">Numerical</option>
                  </select>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={q.marks}
                      onChange={(e) => updateQuestion(qIdx, 'marks', Number(e.target.value))}
                      placeholder="Marks"
                      className="input input-bordered bg-slate-700/50 text-white w-1/2"
                    />
                    <input
                      type="number"
                      value={q.negativeMarks}
                      onChange={(e) => updateQuestion(qIdx, 'negativeMarks', Number(e.target.value))}
                      placeholder="Negative"
                      className="input input-bordered bg-slate-700/50 text-white w-1/2"
                    />
                  </div>
                </div>

                {q.questionType !== 'numerical' && (
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex gap-2 items-center">
                        <input
                          type={q.questionType === 'single' ? 'radio' : 'checkbox'}
                          name={`correct-${qIdx}`}
                          checked={q.correctAnswers.includes(optIdx)}
                          onChange={(e) => {
                            let newCorrect = [...q.correctAnswers];
                            if (q.questionType === 'single') {
                              newCorrect = e.target.checked ? [optIdx] : [];
                            } else {
                              if (e.target.checked) {
                                newCorrect.push(optIdx);
                              } else {
                                newCorrect = newCorrect.filter(i => i !== optIdx);
                              }
                            }
                            updateQuestion(qIdx, 'correctAnswers', newCorrect);
                          }}
                          className="radio radio-primary"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                          placeholder={`Option ${optIdx + 1}`}
                          className="input input-bordered flex-1 bg-slate-700/50 text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button type="button" onClick={addQuestion} className="btn btn-outline btn-primary w-full">
              + Add Question to {sections[currentSectionIndex].name}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? <span className="loading loading-spinner"></span> : 'Create Exam'}
        </button>
      </form>
    </div>
  );
}
