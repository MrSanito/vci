import React from 'react';

const Section1 = () => {
  const steps = [
    {
      id: "01",
      title: "Register",
      desc: "Enroll into the portal and get your unique student roll number.",
      icon: "👤"
    },
    {
       id: "02",
       title: "Take Test",
       desc: "Login and start your assigned exams directly from your dashboard.",
       icon: "⚡"
    },
    {
       id: "03",
       title: "Get Result",
       desc: "Instantly view your score and download your performance report.",
       icon: "📊"
    }
  ];

  return (
    <div className="bg-black py-40 px-8 relative overflow-hidden border-b border-white/5">
        {/* Simple Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF007F] rounded-full blur-[150px] opacity-[0.05] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF007F] rounded-full blur-[150px] opacity-[0.05] -ml-48 -mb-48"></div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-3xl">
                <span className="text-[#FF007F] font-bold uppercase tracking-[0.6em] text-[10px] mb-8 block italic animate-pulse">Our Simple Workflow</span>
                <h2 className="text-6xl md:text-8xl font-extrabold text-white font-heading tracking-tighter italic uppercase leading-none">How It <br /><span className="text-[#FF007F]">Works.</span></h2>
            </div>
            <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[11px] max-w-sm italic leading-relaxed text-right border-r-4 border-[#FF007F] pr-8">
                Easy enrollment and instant examination results for all our students.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.id} className="group relative bg-[#0A0A0A] border border-white/5 p-12 rounded-[3.5rem] hover:border-[#FF007F]/40 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(255,0,127,0.1)]">
               <div className="absolute top-8 right-8 text-7xl font-black text-white/5 group-hover:text-[#FF007F10] transition-colors font-heading rotate-12">{step.id}</div>
               
               <div className="w-16 h-16 bg-black border border-white/10 text-3xl flex items-center justify-center rounded-2xl mb-10 shadow-xl group-hover:rotate-12 transition-all group-hover:bg-[#FF007F] group-hover:border-[#FF007F]">
                  {step.icon}
               </div>

               <h3 className="text-3xl font-extrabold text-white mb-4 uppercase tracking-tighter italic group-hover:text-[#FF007F] transition-colors">{step.title}</h3>
               <p className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest leading-relaxed italic">{step.desc}</p>
               
               <div className="mt-10 w-10 h-1 bg-white/10 group-hover:w-full group-hover:bg-[#FF007F] transition-all duration-700 shadow-[0_0_10px_#FF007F]"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section1;
